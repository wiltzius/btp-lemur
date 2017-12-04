import React from 'react';
import {If, For} from 'jsx-control-statements';
import {dateFormat} from "./lib/util";
import OrderReopenLink from "./OrderReopenLink";
import coreapi from './lib/coreapi';
import {Link} from 'react-router-dom';
import {List, Icon, Transition} from 'semantic-ui-react';

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
    return <div>
      <If condition={this.state.loading === false}>
        <a onClick={this.toggleHidden.bind(this)}>History</a>
        <Icon name='dropdown' rotated={this.state.hidden ? 'counterclockwise' : null}/>
        <Transition visible={this.state.hidden === false} animation="fade" duration={230}>
          <List>
            <For each="order"
                 of={this.state.results}>
              <List.Item key={order.id}>
                <List.Icon name="cubes"/>
                <List.Content>
                  <List.Header>
                    <Link to={'/order/detail/' + order.id}>Order #{order.id}</Link>
                    <span> (<OrderReopenLink orderPk={order.id}/>)</span>
                  </List.Header>
                  <List.Description>
                    opened {dateFormat(order.date_opened)}
                    <If condition={order.status === 'SENT'}>
                      , closed {dateFormat(order.date_closed)}
                      <If condition={order.sender}> by {order.sender}</If>
                    </If>
                    <br/>
                  </List.Description>
                  <List.List>
                    <For each="book"
                         of={order.books}>
                      <List.Item key={book.id}>
                        <List.Icon name='book'/>
                        <List.Content>{book.title}</List.Content>
                      </List.Item>
                    </For>
                  </List.List>
                </List.Content>
              </List.Item>
            </For>
          </List>
        </Transition>
      </If>
    </div>
  }

}

