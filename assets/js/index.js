import React from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import InmateSearchProxy from './InmateSearchProxy.jsx';
import OrderReopenLink from './OrderReopenLink.jsx';
import InmateAddEditForm from './InmateAddEditForm';
import OrderCompleteForm from './OrderCompleteForm';
import OrderDetail from "./OrderDetail";
import OrderTopNavSummary from "./OrderTopNavSummary";
import OrderList from "./OrderList";
import OrderBuild from "./OrderBuild";
import configure from './lib/csrf-jquery-hack';

configure();
console.log('hello');
import InmateSearchDetails from "./InmateSearchDetails";
import InmateSearch from "./InmateSearch";
import InmateSearchForm from "./InmateSearchForm";

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
  ReactDOM.render(<OrderTopNavSummary/>, el);
});

const order_list = document.querySelectorAll('.orderListComponent');
Array.from(order_list).forEach((el) => {
  ReactDOM.render(<OrderList/>, el);
});

const order_build = document.querySelectorAll('.orderBuildComponent');
Array.from(order_build).forEach((el) => {
  ReactDOM.render(<OrderBuild/>, el);
});

const inmate_search = document.querySelectorAll('.inmateSearch');
Array.from(inmate_search).forEach((el) => {
  // const inmate = el.attributes["data-inmate"].value;
  ReactDOM.render(<InmateSearch />, el);
});

// const inmate_search = document.querySelectorAll('.inmateSearchForm');
// Array.from(inmate_search).forEach((el) => {
//   ReactDOM.render(<InmateSearchForm />, el);
// });
