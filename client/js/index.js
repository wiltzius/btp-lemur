//noinspection ES6UnusedImports
import AppContainer from './AppContainer';
import InmateAddForm from './InmateAddForm';
import ReactDOM from 'react/lib/ReactDOM';
import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

ReactDOM.render((
    <Router history={browserHistory}>
      <Route component={AppContainer}>
        <Route path="/app/inmate/search" component="" />
        <Route path="/app/inmate/edit" component={InmateAddForm} />
      </Route>
    </Router>
), document.getElementById('app'));
