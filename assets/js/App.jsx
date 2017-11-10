import React from 'react';
import {Route, NavLink} from 'react-router-dom';
import {withRouter} from 'react-router';
import InmateSearch from "./InmateSearch";
import InmateAddEditForm from "./InmateAddEditForm";
import OrderBuild from "./OrderBuild";
import OrderCompleteForm from "./OrderCompleteForm";
import OrderList from "./OrderList";
import OrderTopNavSummary from "./OrderTopNavSummary";
import _ from 'lodash';

class App extends React.Component {

  render() {
    return <div>
      <div id="topOrderSummary">
        <OrderTopNavSummary/>
      </div>
      <div id="containerpadding">
        {/*TODO set this title in the <title> of the page too*/}
        <h1>{_.get(this.props.location.state, 'title')}</h1>
        <ul id="navlist">
          <li>
            <NavLink to={{
              pathname: "/inmate/search",
              state: {
                title: "Search Inmates"
              }
            }}>search inmates</NavLink>
          </li>
          <li>
            {/*todo make this "edit inmate" if we're editing */}
            <NavLink to={{
              pathname: "/inmate/add",
              state: {
                title: "Add Inmate"
              }
            }}>add inmate</NavLink>
          </li>
          <li>
            <NavLink to={{
              pathname: "/order/list",
              state: {
                title: "Select Existing Order"
              }
            }}>select existing order</NavLink>
          </li>
          <li>
            <NavLink to={{
              pathname: "/order/build",
              state: {
                title: "Build Order"
              }
            }}>build order</NavLink>
          </li>
          <li>
            <NavLink to={{
              pathname: "/order/complete",
              state: {
                title: "Send Out Order"
              }
            }}>send out order</NavLink>
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

export default withRouter(App)
