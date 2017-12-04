import React from 'react';
import coreapi from './lib/coreapi';
import OrderCompleteSummarySnippet from "./OrderCompleteSummarySnippet";
import orderCache from "./lib/orderCache";
import $ from 'jquery';
import {Link, withRouter} from 'react-router-dom';

export default withRouter(class OrderCompleteForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null
    };
  }

  componentDidMount() {
    this.orderUnsub = orderCache.sub(order => {
      this.setState({order: order});
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    this.orderUnsub();
  }

  noOrderSnippet() {
    if (this.state.order) {
      return null;
    }
    else {
      return <div id="searchContainer">
        <p>
          You aren't currently working on an order. <Link to="/inmate/search">Find an inmate to start a new
          order</Link>, or <Link to="/order/list">look at the list of currently open orders.</Link>
        </p>
      </div>
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
    }).then(() => {
      // save off the order id, since after orderCache.unsetOrder this.state.order will be null
      const orderId = this.state.order.id;
      orderCache.unsetOrder().then(() => {
        this.props.history.push('/order/detail/' + orderId);
      });
    })
  }

  submitForm() {
    return <div>
      <strong>Look good?</strong>
      <form onSubmit={this.sendOrder.bind(this)}>
        <label>Sender: <input name="sender" value={this.state.order.sender || ''} type="text"
                              onChange={this.onSenderChange.bind(this)}/></label>
        <div>
          <input name="save" value="Send it." type="submit"/>
        </div>
      </form>
    </div>
  }

  render() {
    if (this.state.loading) {
      return <div id="searchContainer">Loading...</div>
    }
    else if (!this.state.order) {
      return this.noOrderSnippet()
    }
    else {
      return <div id="searchContainer">
        <h3>Order details</h3>
        <p>
          <strong>Review the order below. If it's correct, click the Send It button. If you were looking for a different
            order, <Link to="/order/list">click here</Link>.</strong>
        </p>
        <OrderCompleteSummarySnippet order={this.state.order}/>
        {this.submitForm()}
      </div>
    }
  }
});
