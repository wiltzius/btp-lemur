import React from 'react';
import coreapi from './lib/coreapi';
import orderCache from "./lib/orderCache";
import {Link, withRouter} from "react-router-dom";
import {dateFormat, bookTags} from "./lib/util";
import $ from 'jquery';
import {Button, Popup, Table, Label} from 'semantic-ui-react';

const CLEANUP_ORDER_HELP_TEXT = `Automatically cancels any empty orders and marks all orders currently in process as 
'sent'. If nobody else is currently working on an order and this list is super long, it's probably time to click this 
link.`;

export default withRouter(class OrderList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null,
      orders: [],
      cleaned: false
    };
  }

  componentDidMount() {
    this.orderUnsubscribe = orderCache.sub(order => {
      this.setState({order: order});
      this.setState({loading: false});
    });

    this.loadOrderList();
  }

  loadOrderList() {
    return coreapi.client.action(coreapi.schema, ['orders', 'list'], {status: 'OPEN'}).then(resp => {
      this.setState({orders: resp.results});
    });
  }

  componentWillUnmount() {
    this.orderUnsubscribe();
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

  setOrder(order_id) {
    orderCache.setOrder(order_id).then(() => {
      this.props.history.push('/order/build');
    });
  }

  openOrder(order) {
    return <li key={order.id}>
      <a onClick={() => $("#order" + order.id).toggle('fast')}>
        Order #{order.id}
      </a>
      , opened {dateFormat(order.date_opened)} for {order.inmate.first_name} {order.inmate.last_name}
      <span> [<a onClick={this.setOrder.bind(this, order.id)}>select this order</a>]</span>
      <ul id={"order" + order.id}
          style={{display: 'none'}}>
        {order.books.map(b => <li key={b.id}>{b.title}{b.author ? "by " + b.author : ''}</li>)}
      </ul>
    </li>
  }

  onCleanupClick(event) {
    if (window.confirm("Are you sure you want to delete all the open orders? This can't be undone.")) {
      $.get('/lemur/order/cleanup/').then(() => {
        orderCache.refresh();
        this.loadOrderList();
        this.setState({
          cleaned: true
        })
      });
      return true;
    }
    else {
      event.preventDefault();
    }
  }

  openOrderList() {
    return <div>
      <Table celled compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>Order</Table.HeaderCell>
            <Table.HeaderCell width={2}>Inmate</Table.HeaderCell>
            <Table.HeaderCell width={1}>Opened Date</Table.HeaderCell>
            <Table.HeaderCell>Books</Table.HeaderCell>
            <Table.HeaderCell width={3}/>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.orders.map(o => <Table.Row key={o.id}>
            <Table.Cell>#{o.id}</Table.Cell>
            <Table.Cell><Link to={"/inmate/search/" + o.inmate.id}>{o.inmate.first_name} {o.inmate.last_name}</Link></Table.Cell>
            <Table.Cell>{dateFormat(o.date_opened)}</Table.Cell>
            <Table.Cell>{bookTags(o.books)}</Table.Cell>
            <Table.Cell><Button onClick={this.setOrder.bind(this, o.id)}>Re-Open</Button></Table.Cell>
          </Table.Row>)}
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={5}>
              <Button negative onClick={this.onCleanupClick.bind(this)}>Clean up open orders</Button>
              <Popup trigger={<Button icon='help' />}
                     inverted
                     on='click'
                     hideOnScroll
                     content={CLEANUP_ORDER_HELP_TEXT} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  }

  render() {
    // TODO remove all these dumb loading states and pass the current order down as a top-level property loaded in the App component
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return <div>
      <h3>Open Orders</h3>
      {this.cleaned()}
      {this.orderMsg()}
      <p>To begin a new order, first <Link to="/inmate/search">find the order's inmate</Link>.</p>
      {this.state.orders.length === 0 ? this.noOpenOrders() : this.openOrderList()}
    </div>
  }
})
