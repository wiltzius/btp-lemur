import React from 'react';
import {BrowserRouter, Route, NavLink} from 'react-router-dom';
import InmateSearch from "./InmateSearch";
import InmateAddEditForm from "./InmateAddEditForm";
import OrderBuild from "./OrderBuild";
import OrderCompleteForm from "./OrderCompleteForm";
import OrderList from "./OrderList";
import OrderTopNavSummary from "./OrderTopNavSummary";

export default class App extends React.Component {

  render() {
    return <div>
      <div id="topOrderSummary">
        <OrderTopNavSummary/>
      </div>
      <div id="containerpadding">
        <h1>TODO set title here and in browser window</h1>
        <ul id="navlist">
          <li>
            <NavLink to="/inmate/search">search inmates</NavLink>
          </li>
          <li>
            {/*todo make this "edit inmate" if we're editing */}
            <NavLink to="/inmate/add">add inmate</NavLink>
          </li>
          <li>
            <NavLink to="/order/list">select existing order</NavLink>
          </li>
          <li>
            <NavLink to="/order/build">build order</NavLink>
          </li>
          <li>
            <NavLink to="/order/complete">send out order</NavLink>
          </li>
        </ul>
        <div id="navsep">
          &nbsp;
        </div>
        <Route path="/inmate/search" component={InmateSearch}/>
        <Route path="/inmate/add/:inmate_id" component={InmateAddEditForm}/>
        <Route path="/order/list" component={OrderList}/>
        <Route path="/order/build" component={OrderBuild}/>
        <Route path="/order/complete" component={OrderCompleteForm}/>
      </div>
    </div>
  }
}
