import _ from 'lodash';
import React from 'react';
import {NavLink, Route} from 'react-router-dom';
import {withRouter, matchPath} from 'react-router';
import InmateSearch from "./InmateSearch";
import InmateAddEditForm from "./InmateAddEditForm";
import OrderBuild from "./OrderBuild";
import OrderCompleteForm from "./OrderCompleteForm";
import OrderList from "./OrderList";
import OrderTopNavSummary from "./OrderTopNavSummary";
import OrderDetail from "./OrderDetail";

import {For} from 'jsx-control-statements';

const NAVSTATES = [
  {
    pathname: "/inmate/search",
    path: "/inmate/search/:inmate_id?",
    title: "Search Inmates",
    component: InmateSearch,
  },
  {
    pathname: "/inmate/add",
    title: "Add/Edit Inmate",
    path: "/inmate/add/:inmate_id?",
    component: InmateAddEditForm
  },
  {
    pathname: "/order/list",
    title: "Select Existing Order",
    path: "/order/list",
    component: OrderList
  },
  {
    pathname: "/order/build",
    title: "Build Order",
    path: "/order/build",
    component: OrderBuild
  },
  {
    pathname: "/order/complete",
    title: "Send Out Order",
    path: "/order/complete",
    component: OrderCompleteForm
  },
  {
    pathname: "/order/detail",
    title: "Order Detail",
    path: "/order/detail/:order_id?",
    component: OrderDetail
  }
];

class App extends React.Component {

  get title() {
    const route = _.find(NAVSTATES, n => matchPath(this.props.location.pathname, {path: n.path}));
    if (route) {
      return route.title;
    }
  }

  render() {
    return <div>
      <div id="topOrderSummary">
        <OrderTopNavSummary/>
      </div>
      <div id="containerpadding">
        {/*TODO set this title in the <title> of the page too*/}
        <h1>{this.title}</h1>
        <ul id="navlist">
          <For each="navstate"
               of={NAVSTATES}>
            <li key={navstate.path}>
              <NavLink to={navstate.pathname}>{navstate.title.toLowerCase()}</NavLink>
            </li>
          </For>
        </ul>
        <div id="navsep">
          &nbsp;
        </div>
        <For each="route"
             of={NAVSTATES}>
          <Route key={route.path}
                 path={route.path}
                 component={route.component}/>
        </For>
      </div>
    </div>
  }

}

export default withRouter(App)
