import ReactDOM from 'react/lib/ReactDOM';
import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import AppContainer from './AppContainer';
import InmateAddForm from './InmateAddForm';
import InmateSearch from './InmateSearch/InmateSearch';

ReactDOM.render((
    <Router history={browserHistory}>
      <Route component={AppContainer}>
        <Route path="/app/inmate/search" component={InmateSearch} />
        <Route path="/app/inmate/edit" component={InmateAddForm} />
        <Route path="/app/inmate/add" component={InmateAddForm} />
      </Route>
    </Router>
), document.getElementById('app'));
