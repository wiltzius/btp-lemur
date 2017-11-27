import React from 'react';
import {If, For} from 'jsx-control-statements';
import {dateFormat} from "./lib/util";
import OrderReopenLink from "./OrderReopenLink";
import coreapi from './lib/coreapi';
import {Link} from 'react-router-dom';

export default class InmateSearchOrderHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      loading: true,
      hidden: true
    }
  }

  componentDidMount() {
    // load the order history of this inmate
    // TODO only do this if the thing is opened?
    coreapi.boundAction(['orders', 'list'], {'inmate': this.props.inmate.id}).then(results => {
      this.setState({results: results.results, loading: false});
    });
  }

  toggleHidden() {
    this.setState((prevState, props) => {
      return {hidden: !prevState.hidden}
    });
  }

  render() {
    return <li>
      <a onClick={this.toggleHidden.bind(this)}>History</a>
      <If condition={!this.state.hidden}>
        <ul className="historyList">
          <If condition={this.state.loading === false}>
            <For each="order"
                 of={this.state.results}>
              <li key={order.id}>
                <Link to={'/order/detail/' + order.id}>Order #{order.id}</Link>, (<OrderReopenLink orderPk={order.id}/>)
                opened {dateFormat(order.date_opened)}
                <If condition={order.status === 'SENT'}>
                  , closed {dateFormat(order.date_closed)}
                  <If condition={order.sender}> by {order.sender}</If>
                </If>
                {/* todo show/hide */}
                <ul className="orderlist"
                    id={"orderList" + order.id}
                    style={{display: 'block'}}>
                  <For each="book"
                       of={order.books}>
                    <li key={book.id}>{book.title}</li>
                  </For>
                </ul>
              </li>
            </For>
          </If>
        </ul>
      </If>
    </li>
  }

}

