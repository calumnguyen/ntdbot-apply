import React, { useEffect } from 'react';
import Dashboard from './components/pages/Dashboard';
import Login from './components/Login';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  withRouter,
} from 'react-router-dom';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './routing/PrivateRoute';
import AddUser from './components/pages/users/Adduser';
import View from './components/pages/users/view';
import ViewUser from './components/pages/users/Viewuser';
import AddCustomer from './components/pages/customers/Addcustomer';
import ViewCustomer from './components/pages/customers/Viewcustomer';

import ActivateAccount from './components/pages/ActivateAccount';
import Error from './components/pages/Error';
import './custom.css';

// import Calender from "./components/pages/calender";

// Redux
import { Provider } from 'react-redux';
import store from './store';
import ConfigureSystem from './components/pages/users/ConfigureSystem';
import ConfigureSystemUser from './components/pages/users/ConfigureSystemUser';
import EditUser from './components/pages/users/EditUser';
// import SalaryUpdate from './components/pages/users/SalaryUpdate'
import StoreClosed from './components/pages/StoreClosed';
import ViewOrders from './components/pages/orders/ViewOrders';
import PayOrders from './components/pages/orders/PayOrders';
import ShowReceipts from './components/pages/receipts/ShowReceipts';
import ViewReceipt from './components/pages/receipts/ViewReceipt';

import ViewConfirmation from './components/pages/orders/ViewConfirmation';
import PrintReceipts from './components/pages/receipts/PrintReceipts';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const Main = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/Login' component={Login} />

          {/* Dashboard */}
          <PrivateRoute exact path='/dashboard' component={Dashboard} />

          {/* users */}
          <PrivateRoute exact path='/user/adduser' component={AddUser} />
          <PrivateRoute
            exact
            path='/user/configuresystem'
            component={ConfigureSystem}
          />
          <PrivateRoute
            exact
            path='/user/configuresystemuser'
            component={ConfigureSystemUser}
          />
          <PrivateRoute exact path='/user' component={ViewUser} />
          <PrivateRoute exact path='/user/edituser/:id' component={EditUser} />
          <PrivateRoute exact path='/user/view/:id' component={View} />
          {/* <PrivateRoute exact path='/user/updatesalary/:id' component={SalaryUpdate} /> */}
          <PrivateRoute exact path='/storeclosed' component={StoreClosed} />
          <PrivateRoute
            exact
            path='/ActivateAccount'
            component={ActivateAccount}
          />

          {/* customers */}
          <PrivateRoute
            exact
            path='/customer/addcustomer'
            component={AddCustomer}
          />
          <PrivateRoute exact path='/customer' component={ViewCustomer} />
          <PrivateRoute
            exact
            path='/customer/editcustomer/:id'
            component={AddCustomer}
          />
          <PrivateRoute exact path='/orders' component={ViewOrders} />
          <PrivateRoute exact path='/orders/pay' component={PayOrders} />
          <PrivateRoute exact path='/orders/pay/confirmation' component={ViewConfirmation} />
          
          <PrivateRoute exact path='/receipts/' component={ShowReceipts} />
          <PrivateRoute exact path='/receipts/view/:id' component={ViewReceipt} />
          <PrivateRoute exact path='/receipts/printreceipts' component={PrintReceipts} />
          <PrivateRoute exact path='/Error' component={Error} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default Main;
