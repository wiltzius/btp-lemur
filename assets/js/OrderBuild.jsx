import React from 'react';
import orderCache from "./lib/orderCache";
import OrderBuildISBNForm from "./OrderBuildISBNForm";
import OrderBuildCustomForm from "./OrderBuildCustomForm";
import OrderBuildSearchForm from "./OrderBuildSearchForm";
import OrderBuildSearchResults from "./OrderBuildSearchResults";

export default class OrderBuild extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null
    };
  }

  componentDidMount() {
    orderCache.sub(order => {
      this.setState({order: order});
      this.setState({loading: false});
    });
  }

  orderWarnings() {
    return <div id="orderWarnings">
      {/*todo*/}
      {/*{{currentOrderWarningsHTML}}*/}
    </div>
  }

  bookSearchErrors() {
    //todo
    return <ul id="ASINerrors" className="errors"></ul>
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return <div>
      <div id="searchContainer">
        {this.orderWarnings()}
        {this.bookSearchErrors()}
        <div id="currentOrder">
          {/*{{currentOrderHTML}}*/}
        </div>

        <strong>Search By:</strong>
        <OrderBuildISBNForm/>
        <OrderBuildCustomForm/>
        <OrderBuildSearchForm updateResults={res => this.setState({searchResults: res})}/>
      </div>

      <div id="searchResults">
        <OrderBuildSearchResults results={this.state.searchResults}/>
      </div>
    </div>
  }
}
