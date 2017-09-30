import React from 'react';
import coreapi from './coreapi';
import OrderSummarySnippet from "./OrderSummarySnippet";
import OrderNotes from "./OrderNotes";

export default class OrderDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null
    };
  }

  componentDidMount() {
    // parse the order ID out of the url, todo obviously want to use a router for this instead
    const matches = /lemur\/order\/detail\/([0-9]+)/.exec(window.location.pathname);
    const order_id = matches[1];
    console.log('found order id', order_id);

    coreapi.client.action(coreapi.schema, ['orders', 'read'], {id: order_id}).then(res => {
      this.setState({order: res});
      this.setState({loading: false});
    }).catch(err => {
      console.log(err)
    });

  }

  orderSentSnippet() {
    if (this.state.order.status === 'SENT') {
      return <div>
        <p><strong><span className="orderHeader">Order #{this.state.order.id}</span> marked as sent, please ensure it is
          delivered to the packing station.</strong></p>
        <p><a href={"/lemur/order/invoice/" + this.state.order.id} target="_blank">Print Invoice</a></p>
      </div>
    }
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    else {
      return <div>
        <h3>Order details</h3>
        {this.orderSentSnippet()}
        <OrderSummarySnippet order={this.state.order}/>
        <OrderNotes order={this.state.order} />
      </div>
    }
  }
}
