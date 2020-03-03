import React, { useReducer, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { reducer, loadState, userEffects } from './services/stateMachine'
import LandingLayout from './layouts/LandingLayout'
import LoginLayout from './layouts/LoginLayout'
import UserLayout from './layouts/DistributorLayout'
import Pending from './core/src/components/Elements/Loader'
import NotFound from './pages/NotFound'
import LandingPage from './pages/DistributorLandingPage'
import LoginPage from './pages/DistributorLoginPage'
import LotDetail from './pages/DistributorLotDetail'
import LotsIndex from './pages/DistributorLotsIndex'
import ProductProfilesPage from './pages/DistributorProductProfiles'
import SettingsPage from './pages/DistributorSettings'
import ProductPage from './templates/product'
import './styles/tailwind.css'
import './core/src/styles/icons.css'

const App = () => {
  const [state, dispatch] = useReducer(reducer, loadState())
  //useEffect(() => appEffects(state, dispatch), []) //Use effect as app mounted and unmounted - triggers warning though...?
  useEffect(() => userEffects(state, dispatch), [state])

  /* State Action Dispatch */
  const dispatchLogin = (email, password) => dispatch({
    type: 'loginUser', 
    creds: { email, password } 
  })

  const dispatchLogout = () => dispatch({ 
    type: 'releaseAuth' 
  })

  const dispatchToggleProductProfile = ({ address, cat, entry, value }) => dispatch({ 
    type: 'toggleProductProfile', 
    address, cat, entry, value
  })

  const dispatchExportProductProfile = (product) => dispatch({ 
    type: 'exportProductProfile',
    product
  })

  /* Page Renderers */
  const renderLandingPage = () => (
    <LandingLayout>
      <LandingPage />
    </LandingLayout>
  )

  const renderLoginPage = () => (
    <LoginLayout>
      <LoginPage 
        onLoginSubmit={dispatchLogin} 
        loginError={state.authError || ''} 
        loginPending={(state.type === 'awaitingAuth')} 
      />
    </LoginLayout>
  )

  const renderLotIndex = () => (!state.allLots) ? (
    <Pending />
  ) : (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <LotsIndex 
        lots={state.allLots} 
        selection={state.selection}
        onToggleSelection={dispatchToggleProductProfile} 
      />
    </UserLayout>
  )

  const renderLotDetails = (props) => (!!props?.match?.params?.address && !!state.lotDir[props.match.params.address]) ? (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <LotDetail lot={state.lotDir[props.match.params.address]} />
    </UserLayout>
  ) : (
    <NotFound />
  )

  const renderProductProfiles = () => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <ProductProfilesPage
        email={state.email}
        lots={state.allLots.map(lot => ({
          ...lot,
          parentLot: (!lot.parentLot) ? null : state.lotDir[lot.parentLot.address],
        }))}
        onExportProductProfile={dispatchExportProductProfile}
      />
    </UserLayout>
  )
    
  const renderSettings = () => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <SettingsPage />
    </UserLayout>
  )

  const GuestRouter = () => (
    <Router>
      <Switch>
        <Route exact path="/" render={renderLandingPage} />
        <Route exact path="/login" render={renderLoginPage} />
        <Route render={() => (state.type === 'requireAuth') ? 
          <Redirect to="/login" /> : 
          <Redirect to="/" />} />
      </Switch>
    </Router>
  )

  const renderProductPage = (props) => (!!props?.match?.params?.id) ? (
    <ProductPage id={props.match.params.id} />
  ) : (
    <NotFound />
  )

  const UserRouter = () => (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/distributor/products" />} />
        <Route exact path="/distributor/products" render={renderLotIndex} />
        <Route path="/cultivating/:address" render={renderLotDetails} />
        <Route path="/processing/:address" render={renderLotDetails} />
        <Route exact path="/distributor/product-profiles" render={renderProductProfiles} />
        <Route exact path="/distributor/settings" render={renderSettings} />
        <Route path="/product/:id" render={renderProductPage} />
        <Route render={() => <Redirect to="/distributor/products" />} />
      </Switch>
    </Router>
  )

  return (
    (!state) ? <Pending /> : (!state.authToken) ? <GuestRouter /> : <UserRouter />
  )
}

export default App