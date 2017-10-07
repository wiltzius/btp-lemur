import React from 'react';
import ReactDOM from 'react-dom';
import InmateSearchProxy from './InmateSearchProxy.jsx';
import OrderReopenLink from './OrderReopenLink.jsx';
import InmateAddEditForm from './InmateAddEditForm';
import OrderCompleteForm from './OrderCompleteForm';
import OrderDetail from "./OrderDetail";
import OrderSummary from "./OrderSummary";
import OrderList from "./OrderList";
import OrderBuild from "./OrderBuild";

// bootstrap the React app by attaching InmateSearchProxy instance to their placeholders in the html template
const inmate_search_proxy_containers = document.querySelectorAll('.inmateSearchProxyContainer');
Array.from(inmate_search_proxy_containers).forEach(el => {
  const inmate_pk = el.attributes["data-inmate-id"].value;
  ReactDOM.render(<InmateSearchProxy inmatePk={inmate_pk}/>, el);
});

const alert_link_containers = document.querySelectorAll('.orderReopenLink');
Array.from(alert_link_containers).forEach((el) => {
  const order_href = el.attributes["data-order-href"].value;
  ReactDOM.render(<OrderReopenLink orderHref={order_href}/>, el);
});

const inmate_add_edit_form = document.querySelectorAll('.inmateAddEditForm');
Array.from(inmate_add_edit_form).forEach((el) => {
  ReactDOM.render(<InmateAddEditForm/>, el);
});

const order_sendout = document.querySelectorAll('.orderCompleteForm');
Array.from(order_sendout).forEach((el) => {
  ReactDOM.render(<OrderCompleteForm/>, el);
});

const order_detail = document.querySelectorAll('.orderDetail');
Array.from(order_detail).forEach((el) => {
  ReactDOM.render(<OrderDetail/>, el);
});

const order_summary = document.querySelectorAll('.orderSummary');
Array.from(order_summary).forEach((el) => {
  ReactDOM.render(<OrderSummary/>, el);
});

const order_list = document.querySelectorAll('.orderListComponent');
Array.from(order_list).forEach((el) => {
  ReactDOM.render(<OrderList/>, el);
});

const order_build = document.querySelectorAll('.orderBuildComponent');
Array.from(order_build).forEach((el) => {
  ReactDOM.render(<OrderBuild/>, el);
});
