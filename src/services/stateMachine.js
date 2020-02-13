import ReactDOMServer from 'react-dom/server';
import { receiveUserLots, loginUser } from './traceAPI'

const APP_CACHE = 'trace-app'

const initGuestState = () => ({
  username: 'guest'
})

const initUserState = (username = '', authToken = null) => ({
  username,
  authToken,
  authError: '',
  lotDir: {},
  allLots: [],
  parentLots: [],
  subLots: [],
  selection: {},
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
  !!state && localStorage.setItem(APP_CACHE, JSON.stringify(state)) 
}

export const loadState = (state = localStorage.getItem(APP_CACHE)) => (!!state) ? 
  {...JSON.parse(state), timestamp: undefined, type: undefined} : 
  {...initGuestState()}

const toggleLotDataSelection = (selection, address, cat, entry, value) => {
  const selected = (!selection) ? {} : { ...selection }
  if (!!address && !!cat && !!entry && !!value) {
    selected[address+'-'+cat+'-'+entry] = (!selection[address+'-'+cat+'-'+entry]) ? value : undefined
  } else if (!!address && !!cat && !!entry) {
    selected[address+'-'+cat+'-'+entry] = (!selection[address+'-'+cat+'-'+entry]) ? true : undefined
  } else if (!!address && !!cat) {
    selected[address+'-'+cat] = (!selection[address+'-'+cat]) ? true : undefined
  } else if (!!address) {
    selected[address] = (!selection[address]) ? true : undefined
  }
  return selected
}

const exportLotDataSelection = (selection) => {
  const exp = {}
  const data = {}
  Object.keys(selection).filter((each) => !!each && each.split('-').length === 3).forEach((key) => {
    const keyParts = key.split('-')
    const [ address, cat, entry ] = keyParts
    const value = selection[key]
    if (!value || !address || !selection[address]) return

    if (cat === 'lot' && !!selection[address+'-lot']) {
      if (!data[address]) data[address] = {}
      data[address][entry] = value

    } else if (cat === 'org' && !!selection[address+'-org']) {
      if (!data[address]) data[address] = {}
      if (!data[address].organization) data[address].organization = {}
      data[address].organization[entry] = value

    } else if (!!selection[address+'-'+cat]) {
      if (!data[address]) data[address] = {}
      if (!data[address].state) data[address].state = {}
      if (!data[address].state[cat]) data[address].state[cat] = {}
      data[address].state[cat][entry] = value
    }
  })
  if (!!Object.values(data).length) {
    exp.created = Date.now()
    exp.lots = Object.values(data)
    exp.lotCount = exp.lots.length
    return exp//JSON.stringify(exp)
  } else return null
  
}

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
        selection: state.selection,
        timestamp: Date.now()
      }
    case 'toggleLotDataSelection':
      return { ...state, type: action.type,
        selection: toggleLotDataSelection(state.selection, action.address, action.cat, action.entry, action.value)
      }
    case 'clearLotDataSelection':
      return { ...state, type: action.type,
        selection: {}
      }
    case 'uploadLotDataSelection':
      return { ...state, type: action.type,
        selectionExport: exportLotDataSelection(state.selection)
      }
    case 'uploadingLotDataSelection':
      return { ...state, type: action.type,
        selectionExport: null
      }
    case 'uploadedLotDataSelection':
      return { ...state, type: action.type,
        selectionExport: undefined
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
    /*
    receiveUserLots(
      state.authToken, 
      (lots) => (!lots) ? dispatch({ type: 'requireAuth', authError: '' }) : 
        dispatch({ type: 'receivedLots', lots })
    )
    */
  } else if (!!state.selectionExport) {//create selection
    console.info('^^^ trigger effect upload LotDataSelection')
    const { selectionExport } = state
    dispatch({ type: 'uploadingLotDataSelection' })
    console.log('Uploading LotDataSelection: ', selectionExport)
  } 
  if (!state.creds) persistState(state)
}

export default reducer