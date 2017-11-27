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
    title(match) {
      return "Search Inmates"
    },
    component: InmateSearch,
  },
  {
    pathname: "/inmate/add",
    title(match) {
      // debugger
      if (match.params.inmate_id) {
        return "Edit Inmate"
      }
      else {
        return "Add Inmate"
      }
    },
    path: "/inmate/add/:inmate_id?",
    component: InmateAddEditForm
  },
  {
    pathname: "/order/list",
    title() {
      return "Select Existing Order"
    },
    path: "/order/list",
    component: OrderList
  },
  {
    pathname: "/order/build",
    title() {
      return "Build Order"
    },
    path: "/order/build",
    component: OrderBuild
  },
  {
    pathname: "/order/complete",
    title() {
      return "Send Out Order"
    },
    path: "/order/complete",
    component: OrderCompleteForm
  }
];

class App extends React.Component {

  get title() {
    const route = _.find(NAVSTATES, n => matchPath(this.props.location.pathname, {path: n.path}));
    if (route) {
      return route.title(this.props.match);
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
            <li key={navstate.pathname}>
              <NavLink to={navstate.pathname}>{navstate.title(this.props.match).toLowerCase()}</NavLink>
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
        {/*bonus routes*/}
        {/*<Route path=""*/}
               {/*component={OrderDetail}/>*/}
      </div>
    </div>
  }

}

export default withRouter(App)
