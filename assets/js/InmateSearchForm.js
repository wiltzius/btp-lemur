/**
 * Created by tom on 7/10/17.
 */

import coreapi from './coreapi';
import * as React from "react";

export default class InmateSearchResults extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      model: {}
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.search = this.search.bind(this);
  }

  handleInputChange(event) {
    const newModel = {...this.state.model, [event.target.name]: event.target.value};
    // TODO store the values in the hash or something so they aren't lost on reload
    this.setState({
      model: newModel,
    });
  }

  search(event) {
    event.preventDefault();
    coreapi.boundAction(['inmates', 'list'], {'search': _.values(this.state.model).join(' ')}).then(res => {
      console.log(res);
      this.props.onResultsChange(res.results);
    });
  }

  makeInput(label, name) {
    return <label>
      {label}
      <input type="text"
             name={name}
             value={this.state.model[name]}
             onChange={this.handleInputChange}/>
    </label>
  }

  render() {
    return <form onSubmit={this.search}>
      {/*{% csrf_token %}*/}
      <div id="searchBoxLeft">
        <div className="fieldWrapper">
          {/*{{ form.inmate_id.label_tag }} {{ form.inmate_id }}*/}
          {this.makeInput("Inmate ID", "inmate_id")}
          <p className="note">e.g. K12345</p>
        </div>
      </div>
      <div id="searchBoxRight">
        <div className="fieldWrapper">
          {this.makeInput("First name", "first_name")}
        </div>
        <div className="fieldWrapper">
          {this.makeInput("Last name", "last_name")}
        </div>
      </div>
      <div className="formfooter">
        <input type="submit" name="submit" value="Search for Inmate"/>
      </div>
    </form>

  }

}
