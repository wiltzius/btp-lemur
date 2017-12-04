import * as React from "react";
import InmateSearchForm from "./InmateSearchForm";
import InmateSearchDetails from "./InmateSearchDetails";
import {Item, Divider} from 'semantic-ui-react';

export default class InmateSearch extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      results: []
    }
  }

  render() {
    return <div>
      <InmateSearchForm onResultsChange={res => this.setState({results: res})}/>
      {/* TODO pagination */}
      <If condition={this.state.results.length}>
        <Divider section/>
      </If>
      <Item.Group divided>
        {this.state.results.map(res => <InmateSearchDetails key={res.id} inmate={res}/>)}
      </Item.Group>
    </div>
  }

}
