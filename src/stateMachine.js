const initialState = {
  allLots: undefined,
  parentLots: undefined,
  subLots: undefined,
  lotDir: {},
  pdf: undefined,
  timestamp: undefined //init state - triggers reload lots
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
    case 'receivingLots':
      return { ...state,
        timestamp: Date.now()
      }
    case 'receivedLots':
      return { ...state,
        ...lotsToState(action.lots)
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