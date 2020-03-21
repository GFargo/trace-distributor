import { receiveUserLots, loginUser } from './traceAPI';
import { setProductProfile } from './traceFirebase';


// TODO: Should we make this application specific, e.g. trace-distributor
// ... or would we benenfit from a shared cache?
const APP_CACHE = 'trace-app'

// TODO: Add JEST testing for the various state changes.

const initGuestState = () => ({
  username: 'guest',
  email: undefined,
  authToken: undefined
})

const initUserState = (username = '', email, authToken = null) => ({
  username,
  email,
  authToken,
  authError: '',
  lotDir: {},
  allLots: [],
  parentLots: [],
  subLots: [],
  selection: {},
  timestamp: undefined
})

const userToState = ({ username, email, authToken, lots }) => {
  const state = {
    ...initUserState(username, email, authToken),
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
  !!state && localStorage.setItem(APP_CACHE, JSON.stringify(state)) 
}

export const loadState = (state = localStorage.getItem(APP_CACHE)) => (!!state) ? 
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
          email: state.email,
          authToken: state.authToken,
          lots: action.lots || []
        }),
        timestamp: Date.now()
      }
    case 'exportProductProfile':
      return { ...state, type: action.type,
        productProfileExport: { 
          ...action.product,
          owner: state.email, 
          created: Date.now(), 
        }
      }
    case 'exportingProductProfile':
      return { ...state, type: action.type,
        productProfileExport: null
      }
    case 'exportedProductProfile':
      return { ...state, type: action.type,
        productProfileExport: undefined,
        selection: {}
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

  if (state.type === 'loginUser' && !!state.creds) {//user is logging in
    console.info('^^^ trigger effect user login')
    const { email, password } = state.creds
    if (!!email && !!password) {
      dispatch({ type: 'awaitingAuth' })
      loginUser(
        email, 
        password, 
        ({ username, authToken, authError, lots }) => 
          (!!authError || !authToken) ? dispatch({ type: 'requireAuth', authError }) : 
            dispatch({ type: 'authUser', user: { username, email, authToken, lots } })
      )
    } else {
      dispatch({ type: 'requireAuth' })
    }
  } else if (false && !state.timestamp && !!state.authToken) {//auth'd user refreshed browser
    console.info('^^^ trigger effect lots refresh')
    dispatch({ type: 'receivingLots' })
    receiveUserLots(
      state.authToken, 
      (lots) => (!lots) ? dispatch({ type: 'requireAuth', authError: '' }) : 
        dispatch({ type: 'receivedLots', lots })
    )
  } else if (state.type === 'exportProductProfile' && !!state.productProfileExport) {//create selection
    console.info('^^^ trigger effect exportProductProfile')
    const { productProfileExport } = state
    dispatch({ type: 'exportingProductProfile' })
    setProductProfile(productProfileExport, (id) => dispatch({ type: 'exportedProductProfile'}));
  } 
  if (!state.creds) persistState(state)//never persist user creds
}

export default reducer;
