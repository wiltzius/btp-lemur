import React from "react";
import BannerMessage from './BannerMessage.jsx';
import OrderSummary from './OrderSummary';
import HeaderTitle from './HeaderTitle';
import Navbar from './Navbar';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import lemurReducer from './reducers';
import {setEndpointPath, setEndpointHost} from 'redux-json-api';

export default class AppContainer extends React.Component {


  constructor() {
    super();
    const logger = createLogger();
    this.store = createStore(lemurReducer, applyMiddleware(thunk, logger));
    this.store.dispatch(setEndpointHost(''));
    this.store.dispatch(setEndpointPath('/api'));
  }

  render() {
    return <Provider store={this.store}>
      <div id="container">
        {/* restricted books header */}
        <BannerMessage />
        {/* order summary */}
        <div id="topOrderSummary"><OrderSummary /></div>
        {/* container to pad everything in the main body of the page */}
        <div id="containerpadding">
          {/* begin navbar/header */}
          <HeaderTitle />
          <Navbar />
          <div id="navsep">
            &nbsp;
          </div>
          {/* end nav bar/header */}

          <div id="searchContainer">
            {this.props.children}
          </div>

          <div id="searchResults">
            {/* TODO is this stil used?*/ }
          </div>
        </div>
        {/* footer */}
        <div id="footer">
          UC BTP "Lemur"
        </div>
      </div>
    </Provider>
  }
}
