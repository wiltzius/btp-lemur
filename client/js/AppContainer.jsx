import React from "react";
import BannerMessage from './BannerMessage.jsx';
import OrderSummary from './OrderSummary';
import HeaderTitle from './HeaderTitle';
import Navbar from './Navbar';

export default class AppContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      banner_message: 'loading...'
    }
  }

  componentDidMount() {

  }

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
          // TOOD react's version of ui-router ui-view would go here
        </div>

        <div id="searchResults">
          // TODO this becomes a sub-ui-view, some pages have search results some dont
        </div>
      </div>
      {/* footer */}
      <div id="footer">
        UC BTP "Lemur"
      </div>
    </div>
  }
}
