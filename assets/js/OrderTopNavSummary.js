import React from 'react';
import orderCache from './lib/orderCache';
import _ from 'lodash';
import {Menu} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {bookCount} from "./lib/util";

export default class OrderTopNavSummary extends React.Component {
  // Order summary for the top nav bar

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null
    };
  }

  componentDidMount() {
    this.orderUnsub = orderCache.sub(order => {
      this.setState({order, loading: false});
    });
  }

  componentWillUnmount() {
    this.orderUnsub();
  }

  warnings() {
    if (!_.isEmpty(this.state.order.warnings)) {
      return <span key="why does this need a key???">&nbsp;&nbsp;<span className="error">(<Link to="/order/build">warnings</Link>)</span></span>
    }
  }

  render() {
    const order = this.state.order;
    return <Menu color="blue" borderless>
      <Menu.Item>
        Banner msg here
      </Menu.Item>
      <Menu.Item position="right">
        <If condition={this.state.loading}>
          <span>loading...</span>
        </If>
        <If condition={!this.state.loading && !this.state.order}>
          <span>
            Order: choose an <Link to="/inmate/search">inmate</Link> or <Link to="/order/list">order</Link> first
          </span>
        </If>
        <If condition={this.state.order}>
          {/*<a href="/lemur/order/build">Order #{order.id}</a>,*/}
          <Link to="/order/build">Order #{order.id}</Link>
          {/* todo truncate inmate full name to 50 characters*/}
          &nbsp;for&nbsp;<Link
            to={"/inmate/search/" + order.inmate.id}>{order.inmate.first_name} {order.inmate.last_name}</Link>,
          &nbsp;{bookCount(order.books.length)}
          {this.warnings()}
        </If>
      </Menu.Item>
    </Menu>
    // if (this.state.loading) {
    //   return <span/>;
    // }
    // else if (!this.state.order) {
    //   return <span>
    //     Order: choose an <a href="/lemur/inmate/search">inmate</a> or <a href="/lemur/order/list">order</a> first
    //   </span>
    //
    // }
    // else {
    //   const order = this.state.order;
    //   return <Menu>
    //     <Menu.Item>
    //       <a href="/lemur/order/build">Order #{order.id}</a>,
    //       {/* todo truncate inmate full name to 50 characters*/}
    //       &nbsp;for <a
    //         href={"/lemur/inmate/search/" + order.inmate.id + "/"}>{order.inmate.first_name} {order.inmate.last_name}</a>,
    //       {/* todo make book(s) smart */}
    //       &nbsp;{order.books.length} book(s)
    //       {this.warnings()}
    //     </Menu.Item>
    // </Menu>
    // }
  }
}
