import React from 'react';
import InmateSearchResults from './InmateSearchResults';
import axios from 'axios';

export default class InmateSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formInputs: {}
    };
  }

  componentDidMount() {

  }

  //handleChange(event) {
  //  this.setState({inmate_id: event.target.value});
  //}

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
    console.log(this.state);
    const params = this.state.formInputs;
    params['include'] = 'facility';
    axios.get('/api/inmate/', {
      params: params
    }).then(res => {
      this.setState({
        results: res.data
      })
    });
    event.preventDefault();
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
      <InmateSearchResults results={this.state.results} />
    </div>
  }

}
