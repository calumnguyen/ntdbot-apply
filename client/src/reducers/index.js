import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';

import dashboard from './dashboard';
import user from './user';
import pages from './pages';
import customer from './customer';
import invoice from './invoice';
import alternotes from './alternotes';
import orders from './orders';
import receipts from './receipts';

export default combineReducers({
  alert,
  auth,
  pages,
  user,
  customer,
  dashboard,
  invoice,
  alternotes,
  orders,
  receipts
});
