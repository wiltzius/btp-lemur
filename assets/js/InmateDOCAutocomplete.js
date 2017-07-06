import React from 'react';

export default class InmateDOCAutocomplete extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      proxy_search_results: null
    }
  }

  searchProxies(model) {
    // TODO debounce / throttle this to once a second or something
    console.log('searching');
    $.post('/lemur/inmate/doc_autocomplete/', {
      first_name: model.first_name,
      last_name: model.last_name,
      inmate_id: model.inmate_id
    }).then(resp => {
      this.setState({
        proxy_search_results: resp.proxy_search_results
      })
    });
  }

  componentWillReceiveProps(nextProps) {
    // ({first_name, last_name, inmate_id} = nextProps.model);
    this.searchProxies(nextProps.model)
  }

  render() {
    return <div>
      {
        (this.state.proxy_search_results || [])
          .map((res, idx) =>
            <div key={idx} onClick={() => this.props.selectedCallback(res)}>
              {res.first_name} -
              {res.last_name} -
              {res.inmate_id}
            </div>
          )
      }
    </div>
  }
}
