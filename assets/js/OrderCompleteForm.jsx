import React from 'react';
import coreapi from './lib/coreapi';
import OrderSummarySnippet from "./OrderSummarySnippet";
import orderCache from "./lib/orderCache";

export default class OrderCompleteForm extends React.Component {

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

  noOrderSnippet() {
    if (this.state.order) {
      return null;
    }
    else {
      return <p>
        You aren't currently working on an order. <a href="/lemur/inmate/search">Find an inmate to start a new order</a>,
        or <a href="/lemur/order/list">look at the list of currently open orders.</a>
      </p>
    }
  }

  onSenderChange(event) {
    this.setState({
      'order': {
        ...this.state.order,
        'sender': event.target.value
      }
    })
  }

  sendOrder(event) {
    event.preventDefault();
    console.log('sending...');
    return coreapi.client.action(coreapi.schema, ['orders', 'partial_update'], {
      id: this.state.order.id,
      sender: this.state.order.sender,
      date_closed: (new Date).toISOString(),
      status: 'SENT'
    }).then(resp => {
      // hacky way to unset the session order, just store this in a cookie or local storage instead -- can be all client side
      $.get('/lemur/order/unset').then(() => {
        console.log('done unsetting')
        window.location.href = '/lemur/order/detail/' + this.state.order.id;
      });
    })
  }

  submitForm() {
    return <div>
      <strong>Look good?</strong>
      <form onSubmit={this.sendOrder.bind(this)}>
        <label>Sender: <input name="sender" value={this.state.order.sender} type="text"
                              onChange={this.onSenderChange.bind(this)}/></label>
        <div>
          <input name="save" value="Send it." type="submit"/>
        </div>
      </form>
    </div>
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    else if (!this.state.order) {
      return this.noOrderSnippet()
    }
    else {
      return <div>
        <h3>Order details</h3>
        <p>
          <strong>Review the order below. If it's correct, click the Send It button. If you were looking for a different
            order, <a href="/lemur/order/list">click here</a>.</strong>
        </p>
        <OrderSummarySnippet order={this.state.order}/>
        {this.submitForm()}
      </div>
    }
  }
}
