import { receiveUserLots, loginUser } from './traceAPI'

const LOCAL_CACHE = 'trace-distributor'

const initGuestState = () => ({
  username: 'guest',
  authToken: undefined,// null always triggers login page if !authToken || !!authError
  authError: undefined,
  lotDir: undefined,
  allLots: undefined,
  parentLots: undefined,
  subLots: undefined,
  manifest: undefined,
  timestamp: undefined
})

const initUserState = (username = '', authToken = null) => ({
  username,
  authToken,
  authError: '',
  lotDir: {},
  allLots: [],
  parentLots: [],
  subLots: [],
  manifest: [],
  timestamp: undefined
})

const userToState = ({ username, authToken, lots }) => {
  const state = {
    ...initUserState(username, authToken),
    timestamp: (!!lots) ? Date.now() : null 
  }
  if (!!lots?.length) {
    lots.forEach((lot) => {
      if (!!lot?.address) {
        state.lotDir[lot.address] = lot
        state.allLots.push(lot)
        if (!lot.parentLot) state.parentLots.push(lot)
        else state.subLots.push(lot)
      }
    })
  }
  return state
}

const persistState = async (state) => { 
  !!state && localStorage.setItem(LOCAL_CACHE, JSON.stringify(state)) 
}

export const loadState = (state = localStorage.getItem(LOCAL_CACHE)) => (!!state) ? 
  {...JSON.parse(state), timestamp: undefined, type: undefined} : 
  {...initGuestState()}

export const reducer = (state = loadState(), action = {}) => {

  console.group(action.type)
  console.info('<<< action: ', action)
  switch (action.type) {
    case 'requireAuth': 
      return { ...state, type: action.type,
        authError: action.authError || undefined,
        authToken: null, //while null -> login page
        timestamp: null 
      }
    case 'loginUser': 
      return { ...state, type: action.type, //prevents multi clicks
        authToken: null, //while null -> login page
        authError: undefined, //send auth errors as requireAuth action only
        timestamp: null,
        creds: !(!!action.creds?.email) ? undefined : {
          ...action.creds
        }
      }
    case 'awaitingAuth': 
      return { ...state, type: action.type,
        authToken: null, //while null -> login page
        authError: undefined, //send auth errors as requireAuth action only
        creds: undefined,
        timestamp: Date.now()
      }
    case 'authUser': 
      return { ...state, type: action.type,
        ...userToState(action.user),
        timestamp: Date.now()
      }
    case 'releaseAuth': 
      return { ...state, type: action.type,
        ...initGuestState() //revert to default no auth
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
        manifest: state.manifest,
        timestamp: Date.now()
      }
    case 'addLotToManifest':
      return { ...state, type: action.type,
        manifest: (!state.manifest.includes(action.address)) ? 
          [...state.manifest, action.address] : state.manifest,
        allLots: [...state.allLots]//trying to get the LotsIndex to rerender
      }
    case 'removeLotFromManifest':
      return { ...state, type: action.type,
        manifest: (state.manifest.includes(action.address)) ? 
          state.manifest.filter((lot) => lot !== action.address) : state.manifest,
        allLots: [...state.allLots] //trying to get the LotsIndex to rerender
      }
    default: return state
  }
}

export const appEffects = (state, dispatch) => { 
  console.info('mounted')
  return () => {
    console.info('unmounted')
  }
}

export const userEffects = (state, dispatch) => {
  if (!state.type) console.group('initialState')
  console.info('>>> state: ', state)
  console.groupEnd()

  if (!!state.creds) {//user is logging in
    console.info('^^^ trigger effect user login')
    const { email, password } = state.creds
    dispatch({ type: 'awaitingAuth' })
    loginUser(
      email, 
      password, 
      ({ username, authToken, authError, lots }) => 
        (!!authError || !authToken) ? dispatch({ type: 'requireAuth', authError }) : 
          dispatch({ type: 'authUser', user: { username, authToken, lots } })
    )
  } else if (!state.timestamp && !!state.authToken) {//auth'd user refreshed browser
    console.info('^^^ trigger effect lots refresh')
    dispatch({ type: 'receivingLots' })
    receiveUserLots(
      state.authToken, 
      (lots) => (!lots) ? dispatch({ type: 'requireAuth', authError: '' }) : 
        dispatch({ type: 'receivedLots', lots })
    )
  }
  if (!state.creds) persistState(state)
}

export default reducer