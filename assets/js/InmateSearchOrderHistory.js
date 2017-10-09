import React from 'react';
import If from 'jsx-control-statements';
import {dateFormat} from "./util";
import OrderReopenLink from "./OrderReopenLink";
import coreapi from './lib/coreapi';

export default class InmateSearchOrderHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      loading: true
    }
  }

  componentDidMount() {
    // load the order history of this inmate
    coreapi.boundAction(['orders', 'list'], {'inmate': this.props.inmate.id}).then(results => {
      this.setState({results: results.results, loading: false});
    });
  }

  render() {
    return <li>
      <a>History</a>
      <ul className="historyList" style={{display: 'block'}}>
        <If condition={this.state.loading === false}>
          <For each="order" of={this.state.results}>
            <li key={order.id}>
              {/* TODO restore show/hide of order here */}
              <a>Order #{order.id}</a>, (<OrderReopenLink orderPk={order.id}/>)
              opened {dateFormat(order.date_opened)}
              <If condition={order.status === 'SENT'}>
                , closed {dateFormat(order.date_closed)}
                <If condition={order.sender}> by {order.sender}</If>
              </If>
              {/* todo show/hide */}
              <ul className="orderlist" id={"orderList" + order.id} style={{display: 'block'}}>
                <For each="book" of={order.books}>
                  <li key={book.id}>{book.title}</li>
                </For>
              </ul>
            </li>
          </For>
        </If>
      </ul>
    </li>
  }

}

