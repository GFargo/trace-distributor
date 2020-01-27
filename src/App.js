import React, { useReducer, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Pending from './trace-core/Components/Pending'
import NotFound from './trace-core/Components/NotFound'
import LotDetail from './trace-ext/LotDetail/Distributor-LotDetail'
import LotIndex from './trace-ext/LotsIndex/Distributor-LotsIndex'
import { receiveAllLots, sendUploadPDF} from './traceAPI'
import { reducer, loadState, persistState } from './stateMachine'
import './trace-core/App.css'

const App = () => {
  const [state, dispatch] = useReducer(reducer, loadState())
  useEffect(() => { 
    console.log('>>> mounted')
    return () => {
      console.log('>>> unmounting')
    }
  }, [])

  useEffect(() => {
    console.log('>>> state: ', state)
    if(!!state.pdf) {
      const { result, file } = state.pdf
      dispatch({ type: 'uploadingPDF' })
      sendUploadPDF(result, file, () => dispatch({ type: 'uploadedPDF' }))
    } else if (!state.timestamp) {
      dispatch({ type: 'receivingLots' })
      receiveAllLots(({ lots }) => dispatch({ type: 'receivedLots', lots }))
    }
    persistState(state)
  }, [state])

  const renderLotDetails = (props) => (!!props?.match?.params?.address && !!state.lotDir[props.match.params.address]) ? 
    <LotDetail dispatch={dispatch} lot={state.lotDir[props.match.params.address]} /> : <NotFound />

  const renderLotIndex = (view) => 
    <LotIndex dispatch={dispatch} lots={
      (view === 'cultivating') ? state.parentLots : 
      (view === 'processing') ? state.subLots : 
      state.allLots
    } /> 

  return (
    <Router>
      <div className='replace-with-auth-layer'>
        {!state.allLots ? <Route render={() => <Pending />} /> :
        <Switch>
          <Route exact path="/" render={() => renderLotIndex()} />
          <Route path="/processing/:address" render={renderLotDetails}/>
          <Route exact path="/processing" render={() => renderLotIndex('processing')} />} />
          <Route path="/cultivating/:address" render={renderLotDetails}/>
          <Route exact path="/cultivating" render={() => renderLotIndex('cultivating')} />} />
          <Route render={() => <NotFound />} />
        </Switch>}
      </div>
    </Router>
  )
}

export default App