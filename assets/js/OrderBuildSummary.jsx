import React from 'react';
import orderCache from "./lib/orderCache";

export default class OrderBuild extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null
    };
  }

  componentDidMount() {
    orderCache.sub(order => {
      this.setState({order: order});
      this.setState({loading: false});
    });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    else if (!this.state.order) {
      return <p className="error">
        No current order, <a href="/lemur/inmate/search">find an inmate</a> and add a new order for them
        or <a href="/lemur/order/list">choose an open order</a>.
      </p>
    }
    const order = this.state.order;
    return <div>
      <h5>Current Order</h5>
      <p className="label">Order #{order.id} for {order.inmate.last_name}, {order.inmate.first_name}
        (Inmate #{order.inmate.inmate_id})</p>
      {/*todo fix book pluralization below*/}
      <p><strong>{order.books.length} Book(s):</strong></p>
      {order.books.length === 0
        ? <p>No books in order yet</p>
        : <ul id="orderBookList">
          {order.books.map(b => <li key={b.id}>{b.title} <a onClick={evt => orderCache.removeBook(b)}>remove</a></li>)}
        </ul>
      }
      <a href="/lemur/order/sendout">send this order</a> | <a href="/lemur/order/unset">save it for later</a>
    </div>
  }
}
