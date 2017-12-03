import React from 'react';
import _ from 'lodash';
import $ from 'jquery';

export default class InmateDOCAutocomplete extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      proxy_search_results: null
    }
  }

  searchProxies(first, last, inmate_id) {
    if(this.outstandingXHR) {
      this.outstandingXHR.abort();
    }
    this.outstandingXHR = $.post('/lemur/inmate/doc_autocomplete/', {
      first_name: first,
      last_name: last,
      inmate_id: inmate_id
    });
    this.outstandingXHR.then(resp => {
      console.log('in hte handler');
      // todo if navigating fast its possible to leave the page before this returns, and when it returns setState
      // complains because the component is unmounted...
      this.setState({loading: false});
      this.setState({
        proxy_search_results: resp.proxy_search_results
      })
    });
  }

  componentWillReceiveProps({model, skip}) {
    if (!skip) {
      this.setState({
        loading: true,
      });
      this.debouncedSearchProxy(model.first_name, model.last_name, model.inmate_id)
    }
  }

  componentDidMount() {
    this.debouncedSearchProxy = _.debounce((first, last, inmate_id) => {
      this.searchProxies(first, last, inmate_id);
    }, 400, {leading: true, trailing: true});
  }

  componentWillUnmount() {
    this.debouncedSearchProxy.cancel();
    if (this.outstandingXHR) {
      console.log('aborting');
      this.outstandingXHR.abort();
    }
  }

  render() {
    if (!this.state.loading && !this.state.proxy_search_results) {
      return <div></div>;
    }
    return <div>
      {this.state.loading ? <div>Loading...</div> : ''}
      {this.state.proxy_search_results === null || this.state.proxy_search_results.length === 0 ? '' :
          <div className="inmateAutocomplete">
            {
              (this.state.proxy_search_results || [])
                  .map((res, idx) =>
                          <div key={idx}
                               onClick={() => this.props.selectedCallback(res)}>
                  <span className="autocompleteResult">
                    {res.first_name} {res.last_name} (#{res.inmate_id}), {res.parent_institution}
                    </span>
                          </div>
                  )
            }
          </div>
      }
    </div>
  }
}
