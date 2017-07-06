import React from 'react';

export default class InmateSearchProxy extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: {
        first_name: '',
        last_name: '',
        address: '',
        inmate_id: '',
        facility: null,
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // componentDidMount() {}

  handleInputChange(event) {
    const newModel = {...this.state.model, [event.target.name]: event.target.value};
    this.setState({
      model: newModel
    }, this.searchProxies);   // execute the search proxy after state is set
    console.log(this.state);
  }

  searchProxies() {
    // TODO debounce / throttle this to once a second or something
    $.post('/lemur/inmate/doc_autocomplete/', {
      first_name: this.state.model.first_name,
      last_name: this.state.model.last_name,
      inmate_id: this.state.model.inmate_id
    }).then(resp => {
      this.setState({
        proxy_search_results: resp.proxy_search_results
      })
    });
  }

  render() {
    return <form>
      <div id="searchBoxLeft">
        <div className="fieldWrapper">
          <label>
            First name: <input type="text"
                               name="first_name"
                               value={this.state.model.first_name}
                               onChange={this.handleInputChange}/>
          </label>
          <p className="note">Do not use - or ' characters</p>
        </div>
        <div className="fieldWrapper">
          <label>
            Last name: <input type="text"
                              name="last_name"
                              value={this.state.model.last_name}
                              onChange={this.handleInputChange}/>
          </label>
        </div>
      </div>
      <div id="searchBoxRight">
        <div className="fieldWrapper">
          <label>
            Inmate ID: <input type="text"
                              name="inmate_id"
                              value={this.state.model.inmate_id}
                              onChange={this.handleInputChange}/>
          </label>
        </div>
        <div className="fieldWrapper">
          <label>
            Facility:
            <select type="text"
                    name="facility"
                    value={this.state.model.facility}
                    onChange={this.handleInputChange}>
            </select>
          </label>
        </div>
        {
          this.state.model.facility !== 1 ?
            ''
            :
            <div className="fieldWrapper" id="addressWrapper">
              <label>
                Address: <input type="text"
                                name="address"
                                value={this.state.model.address}
                                onChange={this.handleInputChange}/>
              </label>
            </div>
        }
      </div>
      <div className="formfooter">
        <input type="submit" value="Add New Record"/>
      </div>
      <div>
        {
          (this.state.proxy_search_results || [])
            .map((res, idx) =>
              <div key={idx}>
                {res.first_name} -
                {res.last_name} -
                {res.inmate_id}
              </div>
            )
        }
      </div>
    </form>
  }
}
