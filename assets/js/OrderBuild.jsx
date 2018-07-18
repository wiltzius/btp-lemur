import React from 'react';
import {Message, Grid} from 'semantic-ui-react';

import orderCache from "./lib/orderCache";
import OrderBuildISBNForm from "./OrderBuildISBNForm";
import OrderBuildCustomForm from "./OrderBuildCustomForm";
import OrderBuildSearchForm from "./OrderBuildSearchForm";
import OrderBuildSummary from "./OrderBuildSummary";


export default class OrderBuild extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null,
      errors: []
    };
  }

  componentDidMount() {
    this.orderUnsub = orderCache.sub(order => {
      this.setState({order: order, loading: false});
    });
  }

  componentWillUnmount() {
    this.orderUnsub();
  }

  orderWarnings() {
    if (this.state.order && !_.isEmpty(this.state.order.warnings)) {
      return <Message negative>
        <Message.List items={this.state.order.warnings.map(w => <li key={w}>{w}</li>)}/>
      </Message>
    }
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    } else if (!this.state.order) {
      return <p className="error">
        {/*TODO make into Links*/}
        No current order, <a href="/lemur/inmate/search">find an inmate</a> and add a new order for them
        or <a href="/lemur/order/list">choose an open order</a>.
      </p>
    } else {
      return <Grid centered>
        <Grid.Row>
          <Grid.Column width={7}>
            <OrderBuildISBNForm setError={err => this.setState({errors: [err]})}/>
            <OrderBuildCustomForm setError={err => this.setState({errors: [err]})}/>
            <OrderBuildSearchForm updateResults={res => this.setState({searchResults: res})}/>
          </Grid.Column>
          <Grid.Column width={1}/>
          <Grid.Column width={6}>
            <OrderBuildSummary order={this.state.order}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={14}>
            {this.orderWarnings()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    }
  }
}
