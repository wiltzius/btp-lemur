// import './InmateSearchProxy';
import React from 'react';
import If from 'jsx-control-statements';
import {stringBook, unorderedList} from "./util";
import coreapi from './coreapi';
import OrderReopenLink from "./OrderReopenLink";
// import InmateSearchProxy from "./InmateAddEditForm";

export default class InmateSearchOrderHistory extends React.Component {

  componentDidMount() {
    // load the order history of this inmate
    // coreapi.client.action(coreapi.schema, ['orders', 'list']).then(res => this.setState({facilities: res['results']}));
    // coreapi.boundAction(['orders', 'list'], {'search': _.values(this.state.model).join(' ')}).then(res => {
    //   console.log(res);
    //   this.props.onResultsChange(res.results);
    // });
  }

  render() {
    const inmate = this.props.inmate;

    return <ul className="inmateHistory">
      {/*<li>{% inmate_doc_link inmate.pk "Inmate DOC lookup" %}</li>*/}
      {/* TODO restore show/hide functionality of history here */}
      <li><a>History</a>
        <ul className="historyList" style={{display: 'none'}}>
          <For each="order" of={inmate.orders}>
            <li key={order.pk}>
              {/* TODO restore show/hide of order here */}
              <a>Order #{order.pk}</a>, (<OrderReopenLink orderPk={order.pk} />)
              opened { order.date_opened | date:"M jS, Y" }<If condition={order.status == 'SENT'}>, closed
              {order.date_closed | date:"M jS, Y" }<If condition={order.sender}> by {order.sender }</If></If>
              {/*{% endif %}{% endif %}*/}
              {/*<ul class="orderlist" id="orderList{{ order.pk }}" style="display:none;">*/}
              {/*{% for book in order.books.all %}*/}
              {/*<li>{{book.title }}</li>*/}
              {/*{% endfor %}*/}
              {/*</ul>*/}
            </li>
          </For>
        </ul>
      </li>
      {/*<li><a href="{% url 'inmate-add' %}?inmate_pk={{ inmate.pk }}">Edit Information</a></li>*/}
      {/*<li><a href="{% url 'order-create' inmate_pk=inmate.pk %}" class="bold">Start a new order for this*/}
        {/*inmate</a></li>*/}
    </ul>
  }

}

