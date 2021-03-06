import React from 'react';
import orderCache from './lib/orderCache';

export default class OrderSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    orderCache.sub(order => {
      console.log('setting state');
      this.setState({order, loading: false});
    });
  }

  warnings() {
    if (this.state.order.warnings) {
      return <span>&nbsp;&nbsp;<span className="error">(<a href="/lemur/order/build">warnings</a>)</span></span>
    }
  }

  render() {
    if (this.state.loading) {
      return <span></span>;
    }
    else if (!this.state.order) {
      return <span>
        Order: choose an <a href="/lemur/inmate/search">inmate</a> or <a href="/lemur/order/list">order</a> first
      </span>

    }
    else {
      const order = this.state.order;
      return <div>
        <a href="/lemur/order/build">Order #{order.id}</a>,
        {/*todo truncate inmate full name to 50 characters*/}
        &nbsp;for <a href={"/lemur/inmate/search/" + order.inmate.id + "/"}>{order.inmate.first_name} {order.inmate.last_name}</a>,
        {/*todo make book(s) smart */}
        &nbsp;{order.books.length} book(s)
        {this.warnings()}
      </div>

    }
  }
}
