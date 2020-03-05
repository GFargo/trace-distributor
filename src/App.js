import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { reducer, loadState, userEffects } from './services/stateMachine';
import LandingLayout from './layouts/LandingLayout';
import LoginLayout from './layouts/LoginLayout';
import UserLayout from './layouts/UserLayout';
import Pending from './core/src/components/Elements/Loader';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LotDetailPage from './pages/LotDetailPage';
import LotsIndexPage from './pages/LotsIndexPage';
import ProductProfilesPage from './pages/ProductProfilesPage';
import CreateProductProfilePage from './pages/CreateProductProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProductPage from './templates/product';
import './styles/tailwind.css';
import './core/src/styles/icons.css';


const App = () => {
  const [state, dispatch] = useReducer(reducer, loadState());
  useEffect(() => userEffects(state, dispatch), [state]);

  /* State Action Dispatch */
  const dispatchLogin = (email, password) => dispatch({
    type: 'loginUser', 
    creds: { email, password } 
  });

  const dispatchLogout = () => dispatch({ 
    type: 'releaseAuth' 
  });

  const dispatchToggleProductProfile = ({ address, cat, entry, value }) => dispatch({ 
    type: 'toggleProductProfile', 
    address, cat, entry, value
  });

  const dispatchExportProductProfile = (product) => dispatch({ 
    type: 'exportProductProfile',
    product
  });

  /* Page Renderers */
  const renderLandingPage = () => (
    <LandingLayout>
      <LandingPage />
    </LandingLayout>
  );

  const renderLoginPage = () => (
    <LoginLayout>
      <LoginPage 
        onLoginSubmit={dispatchLogin} 
        loginError={state.authError || ''} 
        loginPending={(state.type === 'awaitingAuth')} 
      />
    </LoginLayout>
  );

  const renderLotIndexPage = () => (!state.allLots) ? (
    <Pending />
  ) : (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <LotsIndexPage 
        lots={state.allLots} 
        selection={state.selection}
        onToggleSelection={dispatchToggleProductProfile} 
      />
    </UserLayout>
  );

  const renderLotDetailsPage = (props) => (!!props?.match?.params?.address && !!state.lotDir[props.match.params.address]) ? (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <LotDetailPage lot={state.lotDir[props.match.params.address]} />
    </UserLayout>
  ) : (
    <NotFound />
  );

  const renderProductProfilesPage = () => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <ProductProfilesPage email={state.email} />
    </UserLayout>
  );

  const renderCreateProductProfilePage = (props) => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <CreateProductProfilePage 
        populateFromID={(!!props?.match?.params?.id) ? props.match.params.id : ''}
        lots={state.allLots.map(lot => ({
          ...lot,
          parentLot: (!lot.parentLot) ? null : state.lotDir[lot.parentLot.address],
        }))}
        handleSubmitProfile={dispatchExportProductProfile}
      />
    </UserLayout>
  );
    
  const renderSettingsPage = () => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <SettingsPage />
    </UserLayout>
  );

  const renderProductPage = (props) => (!!props?.match?.params?.id) ? (
    <ProductPage id={props.match.params.id} />
  ) : (
    <NotFound />
  );

  /* Router Renderers */
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
  );

  const UserRouter = () => (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/distributor/products" />} />
        <Route exact path="/distributor/products" render={renderLotIndexPage} />
        <Route path="/cultivating/:address" render={renderLotDetailsPage} />
        <Route path="/processing/:address" render={renderLotDetailsPage} />
        <Route exact path="/distributor/product-profiles" render={renderProductProfilesPage} />
        <Route exact path="/distributor/product-profile-form" render={renderCreateProductProfilePage} />
        <Route exact path="/distributor/product-profile-form/:id" render={renderCreateProductProfilePage} />
        <Route exact path="/distributor/settings" render={renderSettingsPage} />
        <Route path="/product/:id" render={renderProductPage} />
        <Route render={() => <Redirect to="/distributor/products" />} />
      </Switch>
    </Router>
  );

  return (
    (!state) ? <Pending /> : (!state.authToken) ? <GuestRouter /> : <UserRouter />
  );
}

export default App;