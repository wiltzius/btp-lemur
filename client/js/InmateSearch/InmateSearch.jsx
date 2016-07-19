import React from 'react';
import InmateSearchResults from './InmateSearchResults';
import {readEndpoint} from 'redux-json-api';
import {connect} from 'react-redux';
import _ from 'lodash';
import JsonApiPresenter from '../lib/JsonApiPresenter';


class InmateSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formInputs: {}
    };
  }

  static generateEndpointQuery(state) {
    // TODO stick form state into the query
    return 'inmate?include=facility,order_set,order_set.book_set';
  }

  static inmateListFromQueryResults(state) {
    // inmate list, with subresources inlined
    const query_results = state.inmateSearch.inmate_ids;
    return _.map(query_results, id => JsonApiPresenter.fromId('Inmate', id, state));
  };

  handleChange(propName) {
    const update = function (event) {
      console.log('setting state', propName, 'to', event.target.value);
      const new_state = {
        formInputs: {}
      };
      new_state.formInputs[propName] = event.target.value;
      this.setState(new_state);
    };
    return update.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.dispatch(readEndpoint(InmateSearch.generateEndpointQuery(this.state))).then(resp => {
      this.props.dispatch({
        type: 'INMATE_SEARCH_RESULTS',
        inmate_ids: resp.data.map(i => i.id)
      });
    });
  }

  render() {
    return <div>
      <div id="inmateSearch">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div id="searchBoxLeft">
            <div className="fieldWrapper">
              Inmate ID: <input type="text" value={this.state.formInputs.inmate_id}
                                onChange={this.handleChange('inmate_id')}/>
              <p className="note">e.g. K12345</p>
            </div>
          </div>
          <div id="searchBoxRight">
            <div className="fieldWrapper">
              First name: <input type="text" value={this.state.formInputs.first_name}
                                 onChange={this.handleChange('first_name')}/>
            </div>
            <div className="fieldWrapper">
              Last name: <input type="text" value={this.state.formInputs.last_name}
                                onChange={this.handleChange('last_name')}/>
            </div>
          </div>
          <div className="formfooter">
            <input type="submit" name="submit" value="Search for Inmate"/>
          </div>
        </form>
      </div>
      <InmateSearchResults results={this.props.search_results}/>
    </div>
  }

}

function mapStateToProps(state) {
  return {
    search_results: InmateSearch.inmateListFromQueryResults(state)
  }
}

export default connect(mapStateToProps)(InmateSearch);
