import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { reducer, loadState, userEffects } from './services/stateMachine';
import { useLots, useProducts } from './services/traceFirebase';
import UserLayout from './layouts/UserLayout';
import TraceFooterNav from './components/TraceFooterNav';
import Pending from './core/src/components/Elements/Loader';
import { Layout as CoreLayout } from './core/src/layouts';
import { TracePattern } from './core/src/components/Elements'
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import LotDetailPage from './pages/LotDetailPage';
import LotsIndexPage from './pages/LotsIndexPage';
import CreateLotPage from './pages/CreateLotPage';
import ProductProfilesPage from './pages/ProductProfilesPage';
import CreateProductProfilePage from './pages/CreateProductProfilePage';
import SettingsPage from './pages/SettingsPage';
import './styles/tailwind.css';
import './core/src/styles/icons.css';


const App = () => {
  const [state, dispatch] = useReducer(reducer, loadState());
  useEffect(() => userEffects(state, dispatch), [state]);

  const lotsCollection = useLots(state.email);
  const [ lots ] = lotsCollection;

  const productsCollection = useProducts(state.email);
  const [ products ] = productsCollection;

  /* State Action Dispatch */
  const dispatchLogin = (email, password) => dispatch({
    type: 'loginUser',
    creds: { email, password }
  });

  const dispatchLogout = () => dispatch({
    type: 'releaseAuth'
  });
  
  const dispatchExportProductProfile = (product) => dispatch({
    type: 'exportProductProfile',
    product
  });

  const dispatchExportLot = (lot) => dispatch({
    type: 'exportLot',
    lot
  });

  /* Page Renderers */
  const renderLandingPage = () => (
    <CoreLayout
      headerPadding="py-4 md:py-8"
      headerLogoWidth="215px"
      layoutId="layout_root"
      footerPadding="py-4 md:py-8"
      footerNav={TraceFooterNav}
    >
      <LandingPage />
    </CoreLayout>
  );

  const renderLoginPage = () => (
    <TracePattern className="bg-gray-100" bgPosition="right -35%">
      <CoreLayout
        headerPadding="py-4 md:py-8"
        headerLogoWidth="215px"
        layoutId="layout_root"
        footerPadding="py-4 md:py-8"
        footerNav={TraceFooterNav}
      >
        <LoginPage
          onLoginSubmit={dispatchLogin}
          loginError={state.authError || ''}
          loginPending={(state.type === 'awaitingAuth')}
        />
      </CoreLayout>
    </TracePattern>
  );

  const renderLotIndexPage = () => (
    <UserLayout username={state.username} onLogout={dispatchLogout} showCreateLotButton>
      <LotsIndexPage lotsCollection={lotsCollection} />
    </UserLayout>
  );

  const renderLotDetailsPage = (props) => (
    !!props?.match?.params?.address && !!lots && 
    !!lots.find(one => one.address === props.match.params.address)) ? (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <LotDetailPage lot={lots.find(one => one.address === props.match.params.address)} />
    </UserLayout>
  ) : (
    <NotFound />
  );

  const renderCreateLotPage = (props) => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <CreateLotPage
        populateFromLot={(!!props?.match?.params?.id && !!lots && 
          !!lots.find(one => one.id === props.match.params.id)) ? 
            lots.find(one => one.id === props.match.params.id) : false}
        handleSubmitLot={lot => {
          props.history.push("/distributor/lots");
          dispatchExportLot(lot);
        }}
      />
    </UserLayout>
  );

  const renderProductProfilesPage = () => (
    <UserLayout username={state.username} onLogout={dispatchLogout} showCreateProductButton>
      <ProductProfilesPage productsCollection={productsCollection} />
    </UserLayout>
  );

  const renderCreateProductProfilePage = (props) => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <CreateProductProfilePage
        populateFromProduct={(!!props?.match?.params?.id && !!products && 
          !!products.find(one => one.id === props.match.params.id)) ? 
            products.find(one => one.id === props.match.params.id) : false}
        lots={lots || []}
        handleSubmitProfile={(product) => {
          props.history.push("/distributor/product-profiles");
          dispatchExportProductProfile(product);
        }}
      />
    </UserLayout>
  );

  const renderSettingsPage = () => (
    <UserLayout username={state.username} onLogout={dispatchLogout}>
      <SettingsPage />
    </UserLayout>
  );

  /* Router Renderers */
  const GuestRouter = () => (
    <Router>
      <Switch>
        <Route exact path="/" render={renderLandingPage} />
        <Route exact path="/login" render={renderLoginPage} />
        <Route render={() => (state.type === 'requireAuth') ?
          <Redirect to="/login" /> :
          <Redirect to="/" />
        }/>
      </Switch>
    </Router>
  );

  const UserRouter = () => (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/distributor/lots" />} />
        <Route exact path="/distributor/lots" render={renderLotIndexPage} />
        <Route path="/cultivating/:address" render={renderLotDetailsPage} />
        <Route path="/processing/:address" render={renderLotDetailsPage} />
        <Route exact path="/distributor/lot-form" render={renderCreateLotPage} />
        <Route exact path="/distributor/lot-form/:id" render={renderCreateLotPage} />
        <Route exact path="/distributor/product-profiles" render={renderProductProfilesPage} />
        <Route exact path="/distributor/product-profile-form" render={renderCreateProductProfilePage} />
        <Route exact path="/distributor/product-profile-form/:id" render={renderCreateProductProfilePage} />
        <Route exact path="/distributor/settings" render={renderSettingsPage} />
        <Route path='/p/contact/' component={() => { 
           window.location.href = 'https://tracevt.com/contact/'; 
           return null;
        }}/>
        <Route render={() => <Redirect to="/distributor/lots" />} />
      </Switch>
    </Router>
  );

  return (
    (!state) ? <Pending /> : (!state.authToken) ? <GuestRouter /> : <UserRouter />
  );
}

App.defaultProps = {
  match: {
    params: {
      id: '',
      address: '',
    },
  },
  history: [],
};

App.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      address: PropTypes.string,
    }),
  }),
  history: PropTypes.arrayOf(PropTypes.string),
}

export default App;