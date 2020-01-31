import React, { useReducer, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch} from "react-router-dom"
import Pending from './trace-core/Components/Pending'
import NotFound from './trace-core/Components/NotFound'
import LotDetail from './trace-ext/LotDetail/Distributor-LotDetail'
import LotIndex from './trace-ext/LotsIndex/Distributor-LotsIndex'
import LoginLayout from './layouts/LoginLayout'
import LoginPage from './pages/Public/DistributorLoginPage'
import { receiveAllLots, receiveUserLots, sendUploadPDF, loginUser} from './services/traceAPI'
import { reducer, loadState, persistState } from './stateMachine'

import { TracePattern } from './core/src/components/Elements/Backgrounds/TracePattern';
import './styles/tailwind.css'
import './core/src/styles/icons.css'

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
      loginUser(email, password, ({ username, authToken, authError, lots }) => 
        (!!authError || !authToken) ? dispatch({ type: 'requireAuth', authError }) : 
          dispatch({ type: 'authUser', user: { username, authToken, lots } }))
    } else if(!!state.pdf) {
      const { result, file } = state.pdf
      dispatch({ type: 'uploadingPDF' })
      sendUploadPDF(result, file, () => dispatch({ type: 'uploadedPDF' }))
    } else if (!state.timestamp && !!state.user.authToken) {
      dispatch({ type: 'receivingUserLots' })
      receiveUserLots(state.user.authToken, (lots) => 
        (!lots) ? dispatch({ type: 'requireAuth', authError: '' }) : 
          dispatch({ type: 'receivedUserLots', lots }))
    }
    if(!state.user.creds) persistState(state) //prevent user creds from ever being persisted
  }, [state])

  const renderLotDetails = (props) => (!!props?.match?.params?.address && !!state.lotDir[props.match.params.address]) ? 
    <LotDetail dispatch={dispatch} lot={state.user.organization.lotDir[props.match.params.address]} /> : <NotFound />

  const renderLotIndex = (view) => 
    <LotIndex dispatch={dispatch} lots={
      (view === 'cultivating') ? state.user.organization.parentLots || [] : 
      (view === 'processing') ? state.user.organization.subLots || [] : 
      state.user.organization.allLots || []
    } /> 

  const renderLoginPage = () => 
    <TracePattern className="bg-gray-100" bgPosition="right -35%">
      <LoginLayout>
        <LoginPage 
          onLoginSubmit={(email, password) => dispatch({ type: 'loginUser', email, password })} 
          loginError={state.user.authError || ''} />
      </LoginLayout>
    </TracePattern>
    

  const renderManifestCreator = () => 
    <div>MANIFEST CREATOR</div>
 
  return (
    <Router>
      <div className='replace-with-main-layout-layer'>
        {state.user.authToken === null ? <Route render={renderLoginPage} /> :
        !state.user.organization.allLots ? <Route render={() => <Pending />} /> :
        <Switch>
          <Route exact path="/" render={() => renderLotIndex()} />
          <Route exact path="/login" render={renderLoginPage} />
          {!state.user.authToken && <Route exact path="/distributor" render={renderLoginPage} />}
          {!!state.user.authToken && <Route exact path="/distributor" render={() => renderLotIndex()} />}
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