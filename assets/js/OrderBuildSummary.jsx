import React from 'react';
import {Card, Button, List, Icon, Label} from 'semantic-ui-react';
import orderCache from "./lib/orderCache";
import {Link} from 'react-router-dom';
import {bookCount} from "./lib/util";

export default class OrderBuild extends React.PureComponent {

  render() {
    const order = this.props.order;
    return <Card>
      <Card.Content>
        <Card.Header>Order #{order.id} <em>for</em> {order.inmate.last_name}, {order.inmate.first_name}</Card.Header>
        <Card.Meta>Inmate #{order.inmate.inmate_id}</Card.Meta>
        <Card.Meta>{bookCount(order.books.length, true)}</Card.Meta>

        <Card.Description>
          <If condition={order.books.length > 0}>
            <List>
              {
                order.books.map(b => <List.Item key={b.id}>
                  <Label onRemove={evt => orderCache.removeBook(b)}
                         content={b.title}
                         color="teal"/>
                </List.Item>)
              }
            </List>
          </If>
          <Button color="blue"
                  size="tiny"
                  icon="send"
                  content="Send order"
                  as={Link}
                  to="/order/complete"/>
          <Button size="tiny"
                  content="Save for later"
                  icon="save"
                  onClick={orderCache.unsetOrder.bind(orderCache)}/>
        </Card.Description>
      </Card.Content>
    </Card>
  }
}
