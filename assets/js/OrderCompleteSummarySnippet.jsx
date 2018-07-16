import React from 'react';
import {bookTagsList} from "./lib/util";
import {Item, List} from 'semantic-ui-react';

export default class OrderCompleteSummarySnippet extends React.PureComponent {

  render() {
    const order = this.props.order;
    if (!order.books) {
      return <p><strong>There are no books in this order. <a href="">Add some</a> before sending it out.</strong></p>
    }
    else {
      return <Item.Group>
        <Item>
          <Item.Content>
            <Item.Header>Order #{order.id}, <em>for</em> {order.inmate.first_name} {order.inmate.last_name}
            </Item.Header>
            <Item.Meta>Current Order Status: {order.status}</Item.Meta>
            <Item.Meta>Sender: {order.sender}</Item.Meta>
            <Item.Description>
              <p>Books:</p>
              <List>
                {bookTagsList(order.books)}
              </List>
            </Item.Description>
            <Item.Extra>
              <p>Recipient Name and Address:</p>
              <p>
                {order.inmate.last_name}, {order.inmate.first_name}
                <br/>{order.inmate.address}
              </p>
            </Item.Extra>
          </Item.Content>
        </Item>
      </Item.Group>
    }
  }
}
