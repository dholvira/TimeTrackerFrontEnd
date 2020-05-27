/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import ReactDOM from 'react-dom';
// react library for routing
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';

// react redux
import { Provider } from 'react-redux';
import Store from './config/configureStore';
// plugins styles from node_modules
import 'react-notification-alert/dist/animate.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
// plugins styles downloaded
import 'assets/vendor/fullcalendar/dist/fullcalendar.min.css';
import 'assets/vendor/sweetalert2/dist/sweetalert2.min.css';
import 'assets/vendor/select2/dist/css/select2.min.css';
import 'assets/vendor/quill/dist/quill.core.css';
import 'assets/vendor/nucleo/css/nucleo.css';
import 'assets/vendor/@fortawesome/fontawesome-free/css/all.min.css';
// core styles
import 'assets/scss/argon-dashboard-pro-react.scss?v1.0.0';
import withAuth from './components/hocs/withAuth';

import AdminLayout from 'layouts/Admin.jsx';
import AuthLayout from 'layouts/Auth.jsx';
// import IndexView from 'views/Index.jsx';

ReactDOM.render(
  <Provider store={Store}>
    <HashRouter>
      <Switch>
        <Route path='/admin' component={withAuth(AdminLayout)} />
        {/* <Route path='/admin' render={(props) => <AdminLayout {...props} />} /> */}
        <Route path='/auth' render={(props) => <AuthLayout {...props} />} />
        {/* <Route path='/' render={props => <IndexView {...props} />} /> */}
        <Redirect from='*' to='/auth/login' />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);
