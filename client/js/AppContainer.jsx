import React from "react";
import BannerMessage from './BannerMessage.jsx';
import OrderSummary from './OrderSummary';
import HeaderTitle from './HeaderTitle';
import Navbar from './Navbar';

export default class AppContainer extends React.Component {

  render() {
    return <div id="container">
      {/* restricted books header */}
      <BannerMessage />
      {/* order summary */}
      <div id="topOrderSummary"><OrderSummary /></div>
      {/* container to pad everything in the main body of the page */}
      <div id="containerpadding">
        {/* begin navbar/header */}
        <HeaderTitle />
        <Navbar />
        <div id="navsep">
          &nbsp;
        </div>
        {/* end nav bar/header */}

        <div id="searchContainer">
          {this.props.children}
        </div>

        <div id="searchResults">
          {/* TODO is this stil used?*/ }
        </div>
      </div>
      {/* footer */}
      <div id="footer">
        UC BTP "Lemur"
      </div>
    </div>
  }
}
