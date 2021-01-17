import { combineReducers } from 'redux';
import auth from './auth';
import alert from './alert';

import dashboard from './dashboard';
import user from './user';
import pages from './pages';

export default combineReducers({
  alert,
  auth,
  pages,
  user,
  dashboard
});
