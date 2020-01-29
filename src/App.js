import React, { useReducer, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Pending from './trace-core/Components/Pending'
import NotFound from './trace-core/Components/NotFound'
import LotDetail from './trace-ext/LotDetail/Distributor-LotDetail'
import LotIndex from './trace-ext/LotsIndex/Distributor-LotsIndex'
import { receiveAllLots, sendUploadPDF, loginUser} from './traceAPI'
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
    if(!!state.user.creds) {
      const { email, password } = state.user.creds
      dispatch({ type: 'awaitingAuth' })
      loginUser(email, password, ({ username, authToken, authError, orgs }) => 
        (!!authError || !authToken) ? dispatch({ type: 'requireAuth', authError }) : 
          dispatch({ type: 'authUser', user: { username, authToken, orgs } }))
    } else if(!!state.pdf) {
      const { result, file } = state.pdf
      dispatch({ type: 'uploadingPDF' })
      sendUploadPDF(result, file, () => dispatch({ type: 'uploadedPDF' }))
    } else if (!state.timestamp) {
      dispatch({ type: 'receivingLots' })
      receiveAllLots(({ lots }) => dispatch({ type: 'receivedLots', lots }))
    }
    if(!state.user.creds) persistState(state) //prevent user creds from ever being persisted
  }, [state])

  const renderLotDetails = (props) => (!!props?.match?.params?.address && !!state.lotDir[props.match.params.address]) ? 
    <LotDetail dispatch={dispatch} lot={state.lotDir[props.match.params.address]} /> : <NotFound />

  const renderLotIndex = (view) => 
    <LotIndex dispatch={dispatch} lots={
      (view === 'distributor') ? state.myLots : 
      (view === 'cultivating') ? state.parentLots : 
      (view === 'processing') ? state.subLots : 
      state.allLots
    } /> 

  const renderLoginPage = () => 
    <div>LOGIN PAGE</div> //<LoginLayout><LoginForm http={http} user={state.user} dispatch={dispatch}/></LoginLayout>

  const renderManifestCreator = () => 
    <div>MANIFEST CREATOR</div>
 
  return (
    <Router>
      <div className='replace-with-main-layout-layer'>
        {state.user.authToken === null ? <Route render={renderLoginPage} /> :
        !state.allLots ? <Route render={() => <Pending />} /> :
        <Switch>
          <Route exact path="/" render={() => renderLotIndex()} />
          <Route exact path="/login" render={renderLoginPage} />
          {!state.user.authToken && <Route exact path="/distributor" render={renderLoginPage} />}
          {!!state.user.authToken && <Route exact path="/distributor" render={() => renderLotIndex('distributor')} />}
          {!!state.user.authToken && <Route exact path="/distributor/manifest-creator" render={renderManifestCreator} />}
          <Route path="/processing/:address" render={renderLotDetails} />
          <Route exact path="/processing" render={() => renderLotIndex('processing')} />
          <Route path="/cultivating/:address" render={renderLotDetails} />
          <Route exact path="/cultivating" render={() => renderLotIndex('cultivating')} />
          <Route render={() => <NotFound />} />
        </Switch>}
      </div>
    </Router>
  )
}

export default App