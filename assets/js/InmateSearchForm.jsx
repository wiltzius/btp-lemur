import coreapi from './lib/coreapi';
import * as React from "react";
import {withRouter} from 'react-router-dom';
import {Form, Input, Button} from 'semantic-ui-react';

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

  handleProps() {
    // Whenever we get a new prop for the inmate_id route param, trigger a search for it
    const inmate_id_param = this.props.match.params.inmate_id;
    if (inmate_id_param && this.state.model.inmate_id !== inmate_id_param) {
      this.setState({
        model: {
          ...this.state.model,
          inmate_id: inmate_id_param
        }
      }, () => this.searchApi())
    }
  }

  componentDidMount() {
    this.handleProps();
  }

  handleInputChange(event) {
    const newModel = {...this.state.model, [event.target.name]: event.target.value};
    this.setState({
      model: newModel,
    });
  }

  search(event) {
    event.preventDefault();
    // TODO store the values in the hash or something so they aren't lost on reload. Also update the inmate_id route param
    this.searchApi();
  }

  searchApi() {
    // todo make this search better, like using actual fields at least for ID searching (links to inmate IDs are goofy)
    coreapi.boundAction(['inmates', 'list'], {'search': _.values(this.state.model).join(' ')}).then(res => {
      this.props.onResultsChange(res.results);
    });
  }

  makeInput(label, name) {
    return <Form.Field>
      <label>{label}</label>
      <Input type="text"
             name={name}
             value={this.state.model[name]}
             onChange={this.handleInputChange.bind(this)}/>
    </Form.Field>
  }

  render() {
    return <Form onSubmit={this.search}>
      <Form.Group widths="equal">
        {this.makeInput("Inmate ID", "inmate_id")}
        {this.makeInput("First Name", "first_name")}
        {this.makeInput("Last Name", "last_name")}
      </Form.Group>
      <Button type="submit">Search for Inmate</Button>
    </Form>

  }

});
