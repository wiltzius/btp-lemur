import * as React from "react";
import InmateSearchForm from "./InmateSearchForm";
import InmateSearchDetails from "./InmateSearchDetails";

export default class InmateSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      results: []
    }
  }

  render() {
    return <div id="inmateSearch">
      <InmateSearchForm onResultsChange={res => this.setState({results: res})}/>
      <div id="searchResults">
        {this.state.results.map(res => <InmateSearchDetails key={res.id} inmate={res}/>)}
      </div>
    </div>
  }

}
