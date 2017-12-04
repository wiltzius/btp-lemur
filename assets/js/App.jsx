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
import {Container, Menu, Header, Segment} from 'semantic-ui-react';

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
    return <Container style={{paddingTop: '1.5em'}}>
      <div id="topOrderSummary">
        <OrderTopNavSummary/>
      </div>
      <div id="containerpadding">
        {/*TODO set this title in the <title> of the page too*/}
        <Header as="h2" style={{paddingTop: '1em'}}>{this.title}</Header>
        <Menu pointing>
          <For each="navstate"
               of={NAVSTATES}>
            <Menu.Item key={navstate.path} as={NavLink} to={navstate.pathname}>
              {navstate.title.toLowerCase()}
            </Menu.Item>
          </For>
        </Menu>
        <For each="route"
             of={NAVSTATES}>
          <Route path={route.path}
                 key={route.pathname}
                 render={() => {
                   return <Segment padded><route.component /></Segment>
                 }}/>
        </For>
      </div>
      <Segment textAlign="center" size="small" basic>
        BTP "Lemur" Inventory Manager &mdash; 2017
      </Segment>
    </Container>
  }

}

export default withRouter(App)
