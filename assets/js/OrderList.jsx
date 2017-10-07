import React from 'react';
import coreapi from './lib/coreapi';
import orderCache from "./lib/orderCache";

export default class OrderList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null,
      orders: []
    };
  }

  componentDidMount() {
    orderCache.sub(order => {
      this.setState({order: order});
      this.setState({loading: false});
    });

    return coreapi.client.action(coreapi.schema, ['orders', 'list'], {status: 'OPEN'}).then(resp => {
      this.setState({orders: resp.results});
    });
  }

  cleaned() {
    if (this.state.cleaned) {
      return <p className="message">Cleaned up open orders.</p>
    }
  }

  orderMsg() {
    if (this.state.order) {
      return <p>You are currently working on an order, but you can switch to another open order below.</p>
    }
    else {
      return <p>You don't currently have a working order. From here, you can resume a previously started order.</p>
    }
  }

  noOpenOrders() {
    return <p>There are currently no open orders to resume.</p>
  }

  openOrder(order) {
    return <li key={order.id}>
      <a onClick={() => $("#order" + order.id).toggle('fast')}>
        Order #{order.id}
      </a>
      , opened {order.date_opened} for {order.inmate.first_name} {order.inmate.last_name}
      <span> [<a href={"/lemur/order/set/" + order.id}>select this order</a>]</span>
      <ul id={"order" + order.id} style={{display: 'none'}}>
        {order.books.map(b => <li key={b.id}>{b.title}{b.author ? "by " + b.author : ''}</li>)}
      </ul>
    </li>
  }

  onCleanupClick(event) {
    if (window.confirm("Are you sure you want to delete all the open orders? This can't be undone.")) {
      return true;
    }
    else {
      event.preventDefault();
    }
  }

  openOrderList() {
    return <div>
      <p><a id="cleanupLink" href="/lemur/order/cleanup/" onClick={this.onCleanupClick}>Cleanup Open
        Orders</a>&nbsp;&nbsp;&nbsp;<em>Automatically cancels any empty orders and sends all orders currently in process
        (if nobody else is currently working on an order and this list is super long, it's probably time to click this
        link).</em></p>
      <p>Pick an order below</p>
      <ul>
        {this.state.orders.map(o => this.openOrder(o))}
      </ul>
    </div>
  }


  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return <div>
      <h3>Open Orders</h3>
      {this.cleaned()}
      {this.orderMsg()}
      <p>To begin a new order, first <a href="/lemur/inmate/search">find the order's inmate</a>.</p>
      {this.state.orders.length === 0 ? this.noOpenOrders() : this.openOrderList()}
    </div>
  }
}
