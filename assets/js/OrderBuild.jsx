import React from 'react';
import orderCache from "./lib/orderCache";
import OrderBuildISBNForm from "./OrderBuildISBNForm";
import OrderBuildCustomForm from "./OrderBuildCustomForm";
import OrderBuildSearchForm from "./OrderBuildSearchForm";
import OrderBuildSearchResults from "./OrderBuildSearchResults";
import OrderBuildSummary from "./OrderBuildSummary";

export default class OrderBuild extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null,
      errors: []
    };
  }

  componentDidMount() {
    this.orderUnsub = orderCache.sub(order => {
      console.log('ok', order)
      this.setState({order: order, loading: false});
    });
  }

  componentWillUnmount() {
    this.orderUnsub();
  }

  orderWarnings() {
    if(!this.state.order) {
      return null;
    }
    return <div id="orderWarnings">
      <ul className="errors">
        {this.state.order.warnings.map(w => <li key={w}>{w}</li>)}
      </ul>
    </div>
  }

  bookSearchErrors() {
    return <ul id="ASINerrors" className="errors">
      {this.state.errors.map(err => <li key={err}>{err}</li>)}
    </ul>
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
          <OrderBuildSummary/>
        </div>

        <strong>Search By:</strong>
        <OrderBuildISBNForm setError={err => this.setState({errors: [err]})}/>
        <OrderBuildCustomForm setError={err => this.setState({errors: [err]})}/>
        <OrderBuildSearchForm updateResults={res => this.setState({searchResults: res})}/>
      </div>

      <div id="searchResults">
        <OrderBuildSearchResults results={this.state.searchResults}/>
      </div>
    </div>
  }
}
