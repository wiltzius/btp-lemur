import coreapi from './lib/coreapi';
import * as React from "react";
import {withRouter} from 'react-router-dom';

export default withRouter(class InmateSearchForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      model: {
        inmate_id: '',
        first_name: '',
        last_name: ''
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    const inmate_id_param = this.props.match.params.inmate_id;
    if (inmate_id_param) {
      this.setState({
        model: {
          ...this.state.model,
          inmate_id: inmate_id_param
        }
      }, () => this.searchApi())
    }
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
    this.searchApi();
  }

  searchApi() {
    coreapi.boundAction(['inmates', 'list'], {'search': _.values(this.state.model).join(' ')}).then(res => {
      this.props.onResultsChange(res.results);
    });
  }

  makeInput(label, name) {
    return <label>
      {label}&nbsp;
      <input type="text"
             name={name}
             value={this.state.model[name]}
             onChange={this.handleInputChange.bind(this)}/>
    </label>
  }

  render() {
    return <form onSubmit={this.search}>
      <div id="searchBoxLeft">
        <div className="fieldWrapper">
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

})
