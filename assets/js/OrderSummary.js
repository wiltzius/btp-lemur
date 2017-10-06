import React from 'react';
import orderCache from './lib/orderCache';

export default class OrderSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    orderCache.sub(order => {
      console.log('setting state');
      this.setState({order, loading: false});
    });
  }

  warnings() {
    if (this.state.order.warnings) {
      return <span>&nbsp;&nbsp;<span class="error">(<a href="{% url 'order-build' %}">warnings</a>)</span></span>
    }
  }

  render() {
    if (this.state.loading) {
      return <span></span>;
    }
    else if (!this.state.order) {
      return <span>
        Order: choose an <a href="{% url 'inmate-search' %}">inmate</a> or <a href="{% url 'order-oldlist' %}">order</a> first
      </span>

    }
    else {
      const order = this.state.order;
      return <div>
        <a href="{% url 'order-build' %}">Order #{order.id}</a>,
        {/*todo truncate inmate full name to 50 characters*/}
        &nbsp;for <a href="{% url 'inmate-detail' pk=order.inmate.pk %}">{order.inmate.first_name} {order.inmate.last_name}</a>,
        {/*todo make book(s) smart */}
        &nbsp;{order.books.length} book(s)
        {this.warnings()}
      </div>

    }
  }
}
