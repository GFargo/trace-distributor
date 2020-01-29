const initialUserState = {
  username: 'guest',
  authToken: undefined,
  authError: undefined,
  orgs: undefined, //array of domain names
  timestamp: undefined
}

const testUserState = {
  username: 'Josh',
  authToken: '420',
  authError: undefined,
  orgs: [`decatur.com`, `nyu.edu`, `paultest.com`], //array of domain names
  timestamp: Date.now()
}

const initialState = {
  allLots: undefined,
  parentLots: undefined,
  subLots: undefined,
  myLots: undefined, 
  lotDir: {},
  pdf: undefined,
  timestamp: undefined, //init state - triggers reload lots
  user: {...testUserState}
}

const LOCAL_CACHE = 'trace-distributor'
export const persistState = async (state) => { !!state && localStorage.setItem(LOCAL_CACHE, JSON.stringify(state)) }
export const loadState = (state = localStorage.getItem(LOCAL_CACHE)) => 
  (!!state) ? {...JSON.parse(state), timestamp: undefined} : {...initialState}

const lotsToState = (lots) => {
  const state = {
    allLots: [],
    parentLots: [],
    subLots: [],
    lotDir: {},
    timestamp: null
  }
  if (!!lots?.length) {
    lots.forEach((lot) => {
      if (!!lot?.address) {
        state.lotDir[lot.address] = lot
        state.allLots.push(lot)
        if (!lot.hasParent) state.parentLots.push(lot)
        else state.subLots.push(lot)
      }
    })
    state.timestamp = Date.now()
  }
  return state
}

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'requireAuth': 
      return { ...state,
        user: {
          ...state.user,
          authError: action.authError || undefined,
          authToken: null, //while null -> login page
          timestamp: null 
        }
      }
    case 'loginUser': 
      return { ...state,
        user: {
          ...state.user,
          authToken: null, //while null -> login page
          authError: undefined, 
          creds: {
            email: action.email,
            password: action.password
          }
        }
      }
    case 'awaitingAuth': 
      return { ...state,
        user: {
          ...state.user,
          authToken: null, //while null -> login page
          authError: undefined, //no error while auth is null = pending api call
          creds: undefined
        }
      }
    case 'authUser': 
      return { ...state,
        user: {
          ...action.user,
          authError: undefined, //use requireAuth again if auth error
          timestamp: Date.now() 
        },
        timestamp: null // and reload lots to pop mylots
      }
    case 'releaseAuth': 
      return { ...state,
        user: {
          ...initialUserState //revert to default no auth
        }
      }
    case 'receivingLots':
      return { ...state,
        timestamp: Date.now()
      }
    case 'receivedLots':
      return { ...state,
        ...lotsToState(action.lots, state.user.orgs)
      }
    case 'uploadPDF':
      return { ...state,
        pdf: {
          result: action.result,
          file: action.file
        }
      }
    case 'uploadingPDF':
      return { ...state, 
        pdf: undefined 
      }
    case 'uploadedPDF':
      return { ...state, 
        timestamp: undefined // trigger lots reload
      }
    default: return {...state} //default trigger refresh only
  }
}

export default reducer