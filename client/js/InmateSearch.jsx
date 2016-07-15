import React from 'react';
import InmateSearchResults from './InmateSearchResults';
import {readEndpoint} from 'redux-json-api';
import {connect} from'react-redux';
import axios from 'axios';
import _ from 'lodash';

function map_includes(item, includes, state) {
  const newItem = _.clone(item);
  _.each(includes, include_string => {
    const include_type = _.get(item.relationships, [include_string, 'data', 'type']);
    // TODO if data is an array, then go find all of the entries
    const include_id = _.get(item.relationships, [include_string, 'data', 'id']);
    newItem.attributes[include_string] = _.find(state.api[include_type].data, {id: include_id});
  });
  return newItem;
}

class InmateSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formInputs: {}
    };
  }

  componentDidMount() {

  }

  static generateEndpointQuery(state) {
    return 'inmate?include=facility';
  }

  static inmateListFromQueryResults(state) {
    // inmate list, with subresources inlined
    const query_results = state.inmateSearch.inmate_ids;
    return _.map(query_results, id => {
      console.log('foo');
      const inmate = _.find(state.api.Inmate.data, {id: id});
      const to_return = map_includes(inmate, ['facility'], state);
      console.log('mapped includes are', to_return);
      return to_return;
      //inmate.facility = _.find(state.api.Facility.data, {id: inmate.relationships.facility.data.id});
      //inmate.order_set = _.filter(state.api.Order.data, o => inmate.order_set.data o.id{id: inmate.relationships.facility.data.id});
      //return inmate;
    });
  };

  handleChange(propName) {
    const update = function(event) {
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
    console.log(this.state);
    const params = this.state.formInputs;
    params['include'] = 'facility';
    this.props.dispatch(readEndpoint(InmateSearch.generateEndpointQuery(this.state))).then(resp => {
      this.props.dispatch({
        type: 'INMATE_SEARCH_RESULTS',
        inmate_ids: resp.data.map(i => i.id)
      });
    });
    //axios.get('/api/inmate/', {
    //  params: params
    //}).then(res => {
    //  this.setState({
    //    results: res.data
    //  })
    //});

  }

  render() {
    return <div>
      <div id="inmateSearch">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div id="searchBoxLeft">
            <div className="fieldWrapper">
              Inmate ID: <input type="text" value={this.state.formInputs.inmate_id} onChange={this.handleChange('inmate_id')}/>
              <p className="note">e.g. K12345</p>
            </div>
          </div>
          <div id="searchBoxRight">
            <div className="fieldWrapper">
              First name: <input type="text" value={this.state.formInputs.first_name} onChange={this.handleChange('first_name')}/>
            </div>
            <div className="fieldWrapper">
              Last name: <input type="text" value={this.state.formInputs.last_name} onChange={this.handleChange('last_name')}/>
            </div>
          </div>
          <div className="formfooter">
            <input type="submit" name="submit" value="Search for Inmate" />
          </div>
        </form>
      </div>
      <InmateSearchResults results={this.props.search_results} />
    </div>
  }

}

function mapStateToProps(state) {
  return {
    search_results: InmateSearch.inmateListFromQueryResults(state)
  }
}

export default connect(mapStateToProps)(InmateSearch);
