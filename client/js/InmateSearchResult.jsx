import React from 'react';
import InmateSearchProxy from './InmateSearchProxy';
import OrderReopenLink from './OrderReopenLink';

export default class InmateSearchResult extends React.Component {

  otherRestrictions(inmate) {
    if (inmate.facility.otherRestrictions) {
      return <li>
        <span className="resultLabel">Restrictions:</span>
        <span className="resultValue">{inmate.facility.otherRestrictions}</span>
      </li>
    }
    else {
      return null;
    }
  }

  render() {
    const inmate = this.props.inmate;
    return <div className="inmateResult" id="inmateResult{{ inmate.pk }}">
      <h3>{inmate.full_name}</h3>

      <InmateSearchProxy inmatePk={inmate.pk}/>

      <ul className="inmateDetails">
        <li>
          <span className="resultLabel">Inmate ID:</span><span className="resultValue">{inmate.inmate_id}</span>
        </li>
        <li>
          <span className="resultLabel">Facility:</span><span className="resultValue">{inmate.facility}</span>
        </li>
        {this.otherRestrictions(inmate)}
      </ul>

      <ul className="inmateHistory">
        <li>{/* TODO inmate DOC link */}</li>
        <li><a>History</a>
          <ul className="historyList">
            {inmate.orders.map(o => this.orderListItem(o))}
          </ul>
        </li>
        <li><Link to="/app/inmate/edit">Edit Information</Link></li>
        <li><Link to="/app/order/create" class="bold">Start a new order for this inmate</Link></li>
      </ul>

      {/*
       //<div className="inmateSearchProxyContainer" data-inmate-id="{{ inmate.pk }}"></div>
       <!-- dictionary and other warnings -->
       <ul class="inmateErrors error">
       {{inmate.warnings | unordered_list }}
       {% if inmate.dictionaries|length == 1 %}
       <li>Patron already received dictionary ({{inmate.dictionaries.0 }})</li>
       {% endif %}
       {% if inmate.dictionaries|length > 1 %}
       <li>Patron has already received multiple dictionaries. <a
       href="javascript:$('#inmateResult{{ inmate.pk }} .dictionaries').toggle('fast');">Click to
       expand</a>
       <ul class="dictionaries" style="display:none;">
       {{inmate.dictionaries | unordered_list }}
       </ul>
       </li>
       {% endif %}
       </ul>

       <!-- Inmate DOC details box -->


       <!-- Inmate data from Lemur -->

       */}
    </div>

  }

  orderListItem(o) {
    return <li>
      <a>Order #{o.pk}</a>, (<OrderReopenLink orderPk={o.pk}/>)
      opened {o.date_opened}
      { order.status == 'SENT' ? <span>, closed {o.date_closed}</span> : null}
      { order.sender ? <span>by {o.sender}</span> : null}

      <ul className="orderlist" id="orderList{{ order.pk }}" style="display:none;">
        {order.books.map(b => <li>{b.title}</li>)}
      </ul>
    </li>
  }
}
