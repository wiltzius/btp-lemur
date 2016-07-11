import React from 'react';

export default class InmateSearchResult extends React.Component {

  render() {
    const inmate = this.props.inmate;
    return <div class="inmateResult" id="inmateResult{{ inmate.pk }}">
          <h3>{inmate.full_name}</h3>



      {/*
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
          <div class="inmateSearchProxyContainer" data-inmate-id="{{ inmate.pk }}"></div>

          <!-- Inmate data from Lemur -->
          <ul class="inmateDetails">
            <li><span class="resultLabel">Inmate ID:</span><span class="resultValue">{{inmate.inmate_id }}</span></li>
            <li>
              <span class="resultLabel">Facility:</span><span class="resultValue">{{inmate.facility }}</span>
              {% if inmate.facility.otherRestrictions %}
              <span>({{inmate.facility.otherRestrictions }})</span>
              {% endif %}
            </li>
          </ul>
          <ul class="inmateHistory">
            <li>{% inmate_doc_link inmate.pk "Inmate DOC lookup" %}</li>
            <li><a href="javascript:$('#inmateResult{{ inmate.pk }} .historyList').toggle('fast')">History</a>
              <ul class="historyList" style="display:none;">
                {% for order in inmate.order_set.all %}
                <li>
                  <a href="javascript:$('#orderList{{ order.pk }}').toggle('fast')">Order #{{order.pk }}</a>,
                  (<span class="orderReopenLink" data-order-href="{% url 'order-reopen' order_pk=order.pk %}"></span>)
                  opened {{order.date_opened | date:"M jS, Y" }}{% if order.status == 'SENT' %}, closed
                  {{order.date_closed | date:"M jS, Y" }}{% if order.sender %} by {{order.sender }}
                  {% endif %}{% endif %}
                  <ul class="orderlist" id="orderList{{ order.pk }}" style="display:none;">
                    {% for book in order.book_set.all %}
                    <li>{{book.title }}</li>
                    {% endfor %}
                  </ul>
                </li>
                {% endfor %}
              </ul>
            </li>
            <li><a href="{% url 'inmate-edit' pk=inmate.pk %}">Edit Information</a></li>
            <li><a href="{% url 'order-create' inmate_pk=inmate.pk %}" class="bold">Start a new order for this
              inmate</a></li>
          </ul>*/}
        </div>
        
  }
  
}
