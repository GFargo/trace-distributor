const initialUserState = {
  username: 'guest',
  authToken: null,// null always triggers login page if !authToken || !!authError
  authError: undefined,
  organization: {lotDir:{}}, 
  timestamp: undefined
}

const initialState = {
  allLots: undefined,
  parentLots: undefined,
  subLots: undefined,
  myLots: undefined, 
  lotDir: {},
  pdf: undefined,
  timestamp: undefined, //init state - triggers reload lots
  user: {...initialUserState}
}

const LOCAL_CACHE = 'trace-distributor'
export const persistState = async (state) => { !!state && localStorage.setItem(LOCAL_CACHE, JSON.stringify(state)) }
export const loadState = (state = localStorage.getItem(LOCAL_CACHE)) => 
  (!!state) ? {...JSON.parse(state), timestamp: undefined} : {...initialState}

const lotsToState = (lots, authOrgs) => {
  const state = {
    allLots: [],
    parentLots: [],
    subLots: [],
    myLots: [],
    lotDir: {},
    timestamp: (!!lots) ? Date.now() : null //lots may be empty, but falsy is error
  }
  if (!!lots?.length) {
    lots.forEach((lot) => {
      if (!!lot?.address) {
        state.lotDir[lot.address] = lot
        state.allLots.push(lot)
        if (!lot.hasParent) state.parentLots.push(lot)
        else state.subLots.push(lot)
        if (!!lot.organization?.domain && !!authOrgs?.length && 
            authOrgs.includes(lot.organization.domain)) {
          state.myLots.push(lot)
        }
      }
    })
  }
  return state
}

const userToState = ({ username, authToken, lots }) => {
  const user = {
    username,
    authToken,
    authError: '',
    organization: {
      lotDir: {},
      allLots: [],
      parentLots: [],
      subLots: []
    },
    timestamp: (!!lots) ? Date.now() : null //lots may be empty, but falsy is error
  }
  if (!!lots?.length) {
    lots.forEach((lot) => {
      if (!!lot?.address) {
        user.lotDir[lot.address] = lot
        user.allLots.push(lot)
        if (!lot.hasParent) user.parentLots.push(lot)
        else user.subLots.push(lot)
      }
    })
  }
  return user
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
        },
        timestamp: Date.now()
      }
    case 'authUser': 
      return { ...state,
        user: { ...userToState(action.user || {}) },
        timestamp: Date.now()
      }
    case 'releaseAuth': 
      return { ...state,
        user: {
          ...initialUserState //revert to default no auth
        }
      }
    case 'receivingUserLots':
      return { ...state,
        timestamp: Date.now()
      }
    case 'receivedUserLots':
      return { ...state,
        user: { ...userToState({...state.user, lots: action.lots || []}) },
        timestamp: Date.now()
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