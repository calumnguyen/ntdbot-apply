import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import Error from './components/pages/Error';
import './custom.css';

// Redux
import { Provider } from 'react-redux';
import store from './store';

import Welcome from './components/Home';


const Main = () => {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path='/' component={Welcome} />
          <Route exact path='/Error' component={Error} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default Main;
