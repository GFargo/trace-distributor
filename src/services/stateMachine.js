import { receiveUserLots, loginUser } from './traceAPI'

const initGuestState = {
  username: 'guest',
  authToken: undefined,// null always triggers login page if !authToken || !!authError
  authError: undefined,
  org: {
    lotDir: undefined,
    allLots: undefined,
    parentLots: undefined,
    subLots: undefined
  }, 
  timestamp: undefined
}

const initUserState = {
  username: '',
  authToken: undefined,
  authError: '',
  org: {
    lotDir: {},
    allLots: [],
    parentLots: [],
    subLots: []
  },
  timestamp: undefined
}

const LOCAL_CACHE = 'trace-distributor'
const persistState = async (state) => { !!state && localStorage.setItem(LOCAL_CACHE, JSON.stringify(state)) }
export const loadState = (state = localStorage.getItem(LOCAL_CACHE)) => 
  (!!state) ? {...JSON.parse(state), timestamp: undefined} : {...initGuestState}

const userToState = ({ username, authToken, lots }) => {
  const state = {
    ...initUserState,
    username: username || '',
    authToken: authToken || null,
    timestamp: (!!lots) ? Date.now() : null 
  }
  if (!!lots?.length) {
    lots.forEach((lot) => {
      if (!!lot?.address) {
        state.org.lotDir[lot.address] = lot
        state.org.allLots.push(lot)
        if (!lot.parentLot) state.org.parentLots.push(lot)
        else state.org.subLots.push(lot)
      }
    })
  }
  return state
}

export const reducer = (state = loadState(), action = {}) => {
  switch (action.type) {
    case 'requireAuth': 
      return { ...state, type: action.type,
        authError: action.authError || undefined,
        authToken: null, //while null -> login page
        timestamp: null 
      }
    case 'loginUser': 
      return { ...state, type: action.type,
        authToken: null, //while null -> login page
        authError: undefined, 
        creds: (!action.creds) ? undefined : {
          ...action.creds
        }
      }
    case 'awaitingAuth': 
      return { ...state, type: action.type,
        authToken: null, //while null -> login page
        authError: undefined, //no error while auth is null = pending api call
        creds: undefined,
        timestamp: Date.now()
      }
    case 'authUser': 
      return { ...state, type: action.type,
        ...userToState(action.user || {}),
        timestamp: Date.now()
      }
    case 'releaseAuth': 
      return { ...state, type: action.type,
        ...initGuestState //revert to default no auth
      }
    case 'receivingLots':
      return { ...state, type: action.type,
        timestamp: Date.now()
      }
    case 'receivedLots':
      return { ...state, type: action.type,
        ...userToState({
          username: state.username, 
          authToken: state.authToken, 
          lots: action.lots || []
        }),
        timestamp: Date.now()
      }
    default: return state
  }
}

export const appEffects = (state, dispatch) => { 
  console.log('>>> mounted')
  return () => {
    console.log('>>> unmounting')
  }
}

export const userEffects = (state, dispatch) => {
  console.log('>>> state: ', state)

  if (!!state.creds) {//user is logging in
    const { email, password } = state.creds
    dispatch({ type: 'awaitingAuth' })
    loginUser(
      email, 
      password, 
      ({ username, authToken, authError, lots }) => 
        (!!authError || !authToken) ? dispatch({ type: 'requireAuth', authError }) : 
          dispatch({ type: 'authUser', user: { username, authToken, lots } })
    )
  } else if (!state.timestamp && !!state.authToken) {//user refreshed browser
    dispatch({ type: 'receivingUserLots' })
    receiveUserLots(
      state.authToken, 
      (lots) => (!lots) ? dispatch({ type: 'requireAuth', authError: '' }) : 
        dispatch({ type: 'receivedUserLots', lots })
    )
  }
  if (!state.creds) persistState(state)
}

export default reducer