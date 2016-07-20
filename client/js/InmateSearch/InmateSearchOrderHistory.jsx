import * as React from 'react';
import * as _ from 'lodash';
import OrderReopenLink from '../Helpers/OrderReopenLink';

export default class InmateSearchOrderHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showHistory: false,
      showOrder: _.mapValues(_.keyBy(this.props.orderSet, 'id'), v => false)
    };
  }

  toggleHistory() {
    this.setState({
      showHistory: !this.state.showHistory
    })
  }

  toggleOrder(id) {
    this.setState({
      showOrder: {
        [id]: !this.state.showOrder[id]
      }
    })
  }

  orderListItem(order) {
    return <li key={order.id}>
      <a onClick={this.toggleOrder.bind(this, order.id)}>Order #{order.attributes.pk}</a>,
      (<OrderReopenLink orderPk={order.attributes.pk}/>)
      opened {order.attributes.date_opened}
      { order.attributes.status == 'SENT' ? <span>, closed {order.attributes.date_closed}</span> : null}
      { order.attributes.sender ? <span>by {order.attributes.sender}</span> : null}

      <ul className="orderlist" style={{display: this.state.showOrder[order.id] ? 'initial': 'none'}}>
        {order.includes.book_set.map(b => <li key={b.id}>{b.attributes.title}</li>)}
      </ul>
    </li>
  }

  render() {
    return <span>
      <a onClick={this.toggleHistory.bind(this)}>History</a>
      <ul className="historyList" style={{display: this.state.showHistory ? 'initial': 'none' }}>
        {this.props.orderSet.map(o => this.orderListItem(o))}
      </ul>
    </span>
  }

}
