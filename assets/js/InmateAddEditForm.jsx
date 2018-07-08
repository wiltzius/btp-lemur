import React from 'react';
import coreapi from './lib/coreapi';
import InmateDOCAutocomplete from './InmateDOCAutocomplete';
import {withRouter} from 'react-router-dom';
import {Form, Input, Button, Select, Message} from 'semantic-ui-react';
import {coreAPIErrorToUniqueList} from "./lib/coreapi-error";

export default withRouter(class InmateAddEditForm extends React.Component {

  constructor(props) {
    super(props);
    this.labelMap = null;
    this.state = {
      model: {
        first_name: '',
        last_name: '',
        address: '',
        inmate_id: '',
        facility_id: '1',
      },
      facilities: [],
      sending: false,
      errorDisplay: null
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChangeNoAutocomplete = this.handleInputChangeNoAutocomplete.bind(this);
  }

  facilityListDropdownFormat(facilityList) {
    return facilityList.map(f => {
      return {text: f.name, value: f.id}
    });
  }

  componentDidMount() {
    // load the facilities list
    coreapi
        .client
        .action(coreapi.schema, ['facilities', 'list'])
        .then(res => {
          this.setState({
            facilities: this.facilityListDropdownFormat(res['results'])
          })
        });

    // if we're in edit mode, load the existing inmate
    const pk = this.props.match.params.inmate_id;
    if (pk) {
      coreapi.client.action(coreapi.schema, ['inmates', 'read'], {id: pk}).then(res => {
        this.setState({model: res})
      });
      this.setState({
        mode: 'edit'
      });
    }
  }

  handleInputChange(event, reset_autocomplete = true) {
    const newModel = {...this.state.model, [event.target.name]: event.target.value};
    this.setState({
      model: newModel,
      autocompleted: reset_autocomplete ? false : this.state.autocompleted,
    });
  }

  handleInputChangeNoAutocomplete(event) {
    debugger
    this.handleInputChange(event, false);
  }

  handleFacilityChange(_event, selected) {
    this.setState({
      model: {
        ...this.state.model,
        facility_id: selected.value
      }
    })
  }

  autocompleteSelected(doc_inmate) {
    const newModel = {
      ...this.state.model,
      first_name: doc_inmate.first_name,
      last_name: doc_inmate.last_name,
      inmate_id: doc_inmate.inmate_id,
    };
    if (doc_inmate.facility) {
      // FIXME needs to deal with ids now
      newModel.facility = doc_inmate.facility
    }
    this.setState({
      model: newModel,
      autocompleted: true
    })
  };

  handleSubmit(event) {
    event.preventDefault();
    let p;
    this.setState({sending: true});
    if (this.state.mode === 'edit') {
      // only save the fields that are actually visible on the form
      const to_save = _.pick(this.state.model,
          ['first_name', 'last_name', 'inmate_id', 'id', 'facility_id', 'address']);
      p = coreapi.client.action(schema, ['inmates', 'update'], to_save);
    }
    else {
      p = coreapi.client.action(schema, ['inmates', 'create'], this.state.model);
    }
    // What to do if the component is navigated away from before the callbacks fire? Calling setState triggers a React
    // warning.
    p.then(resp => {
      this.setState({sending: false});
      this.props.history.push(`/inmate/search/${resp.inmate_id}`);
    }).catch(err => {
      // must ensure error list is unique or React will throw key uniqueness errors
      this.setState({
        sending: false,
        errorDisplay: coreAPIErrorToUniqueList(err, this.labelMap)
      });
    });
  }

  makeInput(label, name, inputProps={}) {
    this.labelMap[name] = label;
    return <Form.Field>
      <label>{label}</label>
      <Input type="text"
             name={name}
             value={this.state.model[name]}
             onChange={this.handleInputChange.bind(this)}
             {...inputProps}/>
    </Form.Field>
  }

  render() {
    // build a label map up (here and through makeInput calls) for later reference; inefficient to do every render but
    // o well
    this.labelMap = {facility_id: 'Facility'};

    // noinspection EqualityComparisonWithCoercionJS
    return <Form onSubmit={this.handleSubmit}>

      <Form.Group widths="equal">
        {this.makeInput('First Name', 'first_name')}
        {this.makeInput('Last Name', 'last_name')}
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Field>
          <label>Facility</label>
          <Select name='facility_id'
                  value={this.state.model.facility_id}
                  options={this.state.facilities}
                  onChange={this.handleFacilityChange.bind(this)}
          />
        </Form.Field>
        {this.makeInput('Inmate ID', 'inmate_id')}
      </Form.Group>


      <Form.Group widths="equal">
        {this.makeInput('Address', 'address', {disabled: this.state.model.facility_id != "1"})}
        <Form.Field>
          {/*todo dumb alignment hack*/}
          <label>&nbsp;</label>
          <Button type="submit">
            {this.state.mode === 'edit' ? "Save" : "Add New Record"}
          </Button>
        </Form.Field>
      </Form.Group>

      <If condition={this.state.errorDisplay}>
        <Message negative>
          <Message.Header>Error in submission</Message.Header>
          <Message.List items={this.state.errorDisplay}/>
        </Message>
      </If>

      {/* TODO always pad the Form so it doesn't change height when this blips in and out */}
      <InmateDOCAutocomplete model={this.state.model}
                             selectedCallback={this.autocompleteSelected.bind(this)}
                             skip={this.state.autocompleted}/>
    </Form>
  }
})
