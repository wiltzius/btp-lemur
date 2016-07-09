import React from 'react';

export default class OrderSummary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentOrder: null
    }
  }
 
  componentDidMount() {

  }
 
  render() {
    if(this.state.currentOrder) {
      return <span><a href="">Order #</a>, for <a href="">name</a></span>;
    }
    else {
      return <span>Order: choose an <a href="{% url 'inmate-search' %}">inmate</a> or <a href="{% url 'order-list' %}">order</a> first</span>
    }

    // {% with request.session.order as order %}
    //   {% if order %}
    //     <a href="{% url 'order-build' %}">Order #{{order.pk}}</a>, for <a href="{% url 'inmate-detail' pk=order.inmate.pk %}">{{order.inmate.full_name|truncchar:50}}</a>, {{order.book_set.all.count}} book{{order.book_set.all.count|pluralize}}
    //     {% if order.warnings|length > 0 %}
    //     &nbsp;&nbsp;<span class="error">(<a href="{% url 'order-build' %}">warnings</a>)</span>
    //     {% endif %}
    //   {% else %}
    //     <!-- there isn't a current order -->
    //     Order: choose an <a href="{% url 'inmate-search' %}">inmate</a> or <a href="{% url 'order-list' %}">order</a> first
    //   {% endif %}
    // {% endwith %}
  }
  
}
