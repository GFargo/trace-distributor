import React, { useReducer, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { reducer, loadState, userEffects } from './services/stateMachine'
import LandingLayout from './layouts/LandingLayout'
import LoginLayout from './layouts/LoginLayout'
import UserLayout from './layouts/DistributorLayout'
import Pending from './pages/PendingTrans'
import NotFound from './pages/NotFound'
import LandingPage from './pages/DistributorLandingPage'
import LoginPage from './pages/DistributorLoginPage'
import LotDetail from './pages/DistributorLotDetail'
import LotsIndex from './pages/DistributorLotsIndex'
import ManifestPage from './pages/DistributorManifestCreator'
import SettingsPage from './pages/DistributorSettings'
import './styles/tailwind.css'
import './core/src/styles/icons.css'

const App = () => {
  const [state, dispatch] = useReducer(reducer, loadState())
  //useEffect(() => appEffects(state, dispatch), []) //Use effect as app mounted and unmounted - triggers warning though...?
  useEffect(() => userEffects(state, dispatch), [state])

  const renderLandingPage = () => <LandingLayout><LandingPage /></LandingLayout>

  const renderLoginPage = () => 
    <LoginLayout><LoginPage 
      onLoginSubmit={(email, password) => dispatch({ type: 'loginUser', creds: { email, password } })} 
      loginError={state.authError || ''} 
      loginPending={(state.type === 'awaitingAuth')} 
    /></LoginLayout>

  const renderLotIndex = () => (!state.allLots) ? <Pending /> : 
    <LotsIndex 
      lots={state.allLots} 
      manifest={state.manifest}
      onAddLot={({address}) => dispatch({ type: 'addLotToManifest', address })} 
      onRemoveLot={({address}) => dispatch({ type: 'removeLotFromManifest', address })}
    />

  const renderLotDetails = (props) => (!!props?.match?.params?.address && !!state.lotDir[props.match.params.address]) ? 
    <LotDetail lot={state.lotDir[props.match.params.address]} /> : <NotFound />

  const renderManifestCreator = () => <ManifestPage />

  const renderSettings = () => <SettingsPage />

  return (
    <Router>
      {(!state) ? <Pending /> : (!state.authToken) ? (
        <Switch>
          <Route exact path="/" render={renderLandingPage} />
          <Route exact path="/login" render={renderLoginPage} />
          <Route render={() => (state.type === 'requireAuth') ? 
            <Redirect to="/login" /> : <Redirect to="/" />} />
        </Switch>
      ) : (
        <UserLayout username={state.username} onLogout={() => dispatch({ type: 'releaseAuth' })}>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/distributor/products" />} />
            <Route exact path="/distributor/products" render={renderLotIndex} />
            <Route path="/cultivating/:address" render={renderLotDetails} />
            <Route path="/processing/:address" render={renderLotDetails} />
            <Route exact path="/distributor/manifest-creator" render={renderManifestCreator} />
            <Route exact path="/distributor/settings" render={renderSettings} />
            <Route render={() => <Redirect to="/distributor/products" />} />
          </Switch>
        </UserLayout>
      )}
    </Router>
  )
}

export default App