import React from 'react';
import coreapi from './lib/coreapi';
import InmateDOCAutocomplete from './InmateDOCAutocomplete';
import {withRouter} from 'react-router-dom';
import {Form, Input, Button, Select, Message} from 'semantic-ui-react';
import {coreAPIErrorToList} from "./lib/coreapi-error";

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

  componentDidMount() {
    // load the facilities list
    coreapi.client.action(coreapi.schema, ['facilities', 'list']).then(res => this.setState({facilities: res['results']}));

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
    this.handleInputChange(event, false);
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
    p.then(resp => {
      console.log('hello');
      this.props.history.push(`/inmate/search/${resp.inmate_id}`);
    }).catch(err => {
      this.setState({errorDisplay: coreAPIErrorToList(err, this.labelMap)});
    }).finally(() => {
      this.setState({sending: false});
    });
  }

  makeInput(label, name) {
    this.labelMap[name] = label;
    return <Form.Field>
      <label>{label}</label>
      <Input type="text"
             name={name}
             value={this.state.model[name]}
             onChange={this.handleInputChange.bind(this)}/>
    </Form.Field>
  }

  render() {
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
                  options={[]}
                  onChange={this.handleInputChangeNoAutocomplete}
          />
        </Form.Field>
        {this.makeInput('Inmate ID', 'inmate_id')}
      </Form.Group>
      <Form.Group>
        {
          this.state.model.facility_id !== "1" ? '' : this.makeInput('Address', 'address')
        }
      </Form.Group>
      <Form.Group>
        <Button type="submit">
          {this.state.mode === 'edit' ? "Save" : "Add New Record"}
        </Button>
      </Form.Group>
      <Form.Group>


        {/*<div id="searchBoxLeft">*/}
        {/*<div className="fieldWrapper">*/}
        {/*<label>*/}
        {/*First name: <input type="text"*/}
        {/*name="first_name"*/}
        {/*value={this.state.model.first_name}*/}
        {/*onChange={this.handleInputChange}/>*/}
        {/*</label>*/}
        {/*<p className="note">Do not use - or ' characters</p>*/}
        {/*</div>*/}
        {/*<div className="fieldWrapper">*/}
        {/*<label>*/}
        {/*Last name: <input type="text"*/}
        {/*name="last_name"*/}
        {/*value={this.state.model.last_name}*/}
        {/*onChange={this.handleInputChange}/>*/}
        {/*</label>*/}
        {/*</div>*/}
        {/*</div>*/}
        {/*<div id="searchBoxRight">*/}
        {/*<div className="fieldWrapper">*/}
        {/*<label>*/}
        {/*Inmate ID: <input type="text"*/}
        {/*name="inmate_id"*/}
        {/*value={this.state.model.inmate_id}*/}
        {/*onChange={this.handleInputChange}/>*/}
        {/*</label>*/}
        {/*</div>*/}
        {/*<div className="fieldWrapper">*/}
        {/*<label>*/}
        {/*Facility:*/}
        {/*<select type="text"*/}
        {/*name="facility_id"*/}
        {/*value={this.state.model.facility_id}*/}
        {/*>*/}
        {/*{*/}
        {/*this.state.facilities.map(facility =>*/}
        {/*<option key={facility.id}*/}
        {/*value={facility.id}>{facility.name}</option>*/}
        {/*)*/}
        {/*}*/}
        {/*</select>*/}
        {/*</label>*/}
        {/*</div>*/}
        {/*{*/}
        {/*this.state.model.facility_id != "1" ?*/}
        {/*''*/}
        {/*:*/}
        {/*<div className="fieldWrapper"*/}
        {/*id="addressWrapper">*/}
        {/*<label>*/}
        {/*Address: <input type="text"*/}
        {/*name="address"*/}
        {/*value={this.state.model.address}*/}
        {/*onChange={this.handleInputChange}/>*/}
        {/*</label>*/}
        {/*</div>*/}
        {/*}*/}
        {/*</div>*/}
        {/*<div className="formfooter">*/}
        {/*<input type="submit"*/}
        {/*value={this.state.mode === 'edit' ? "Save" : "Add New Record"}/>*/}
        {/*</div>*/}
      </Form.Group>
      <If condition={this.state.errorDisplay}>
        <Message negative>
          <Message.Header>Error in submission</Message.Header>
          <Message.List items={this.state.errorDisplay}/>
        </Message>
      </If>
      <InmateDOCAutocomplete model={this.state.model}
                             selectedCallback={this.autocompleteSelected.bind(this)}
                             skip={this.state.autocompleted}/>
    </Form>
  }
})
