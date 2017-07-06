import React from 'react';
import coreapi from './coreapi';
import InmateDOCAutocomplete from "./InmateDOCAutocomplete";

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
      },
      facilities: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    coreapi.client.action(coreapi.schema, ['facilities', 'list']).then(res => this.setState({facilities: res}));
  }

  handleInputChange(event) {
    const newModel = {...this.state.model, [event.target.name]: event.target.value};
    this.setState({
      model: newModel
    }, this.searchProxies);   // execute the search proxy after state is set
    console.log(this.state);
  }

  autocompleteSelected(doc_inmate) {
    const newModel = {
      ...this.state.model,
      first_name: doc_inmate.first_name,
      last_name: doc_inmate.last_name,
      inmate_id: doc_inmate.inmate_id,
      // facility: doc_inmate.facility.pk
    };
    this.setState({
      model: newModel
    })
  };

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
              {
                this.state.facilities.map(facility =>
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                )
              }
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
      <InmateDOCAutocomplete model={this.state.model} selectedCallback={this.autocompleteSelected.bind(this)} />
    </form>
  }
}
