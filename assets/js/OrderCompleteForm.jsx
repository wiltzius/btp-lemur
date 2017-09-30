import React from 'react';
import coreapi from './coreapi';

export default class OrderCompleteForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null
    };
  }

  componentDidMount() {
    $.getJSON('/lemur/order/current/').then(resp => {
      const order_id = resp.current_order_id;
      if (order_id) {
        return coreapi.client.action(coreapi.schema, ['orders', 'read'], {id: order_id}).then(res => {
          this.setState({order: res});
          this.setState({loading: false});
        });
      }
      else {
        this.setState({loading: false});
      }
    }).catch(err => {
      console.log(err)
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

  orderBookSummarySnippet() {
    const order = this.state.order;
    if (!order.books) {
      return <p><strong>There are no books in this order. <a href="">Add some</a> before sending it out.</strong></p>
    }
    else {
      return <div><p>
        <strong>Review the order below. If it's correct, click the Send It button. If you were looking for a different
          order, <a href="/lemur/order/list">click here</a>.</strong>
      </p>
        <div id="sendReady">
          <h4>Name and Address:</h4>
          <p>{order.inmate.last_name}, {order.inmate.first_name}<br/>
            {order.inmate.address}
          </p>
          <h4>Books:</h4>
          <ul className="sendItems">
            {_.map(order.books, book => {
              return <li key={book.id}>
                <span className="resName">{book.title}</span>{book.author ? <span>by {book.author}</span> : ''}
              </li>
            })}
          </ul>
        </div>
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
    }).then(resp => {
      window.location.href = '/lemur/order/unset';
    })
  }

  submitForm() {
    return <div>
      <strong>Look good?</strong>
      <form onSubmit={this.sendOrder.bind(this)}>
        <label>Sender: <input name="sender" value={this.state.order.sender} type="text"
                              onChange={this.onSenderChange.bind(this)}/></label>
        <input name="save" value="Send it." type="submit"/>
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
        {this.orderBookSummarySnippet()}
        {this.submitForm()}
      </div>
    }
  }
}
