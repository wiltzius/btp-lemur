import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Modal from 'react-modal';
import axios from 'axios';

export default class InmateAddForm extends React.Component {

  constructor() {
    super();

    this.state = {
      attemptingInmateId: true
    };
  }

  handleChange(propName, event) {
    console.log('setting state', propName, 'to', event.target.value);
    const new_state = {};
    new_state[propName] = event.target.value;
    this.setState(new_state);
  }

  submitHandler(event) {

  }

  submitInmateIdHandler(event) {
    event.preventDefault();   // we don't want the form to actually be submitted
    console.log('running with event');
    axios.get('/lemur/inmate_search_proxy_id/' + this.state.inmate_id).then((resp) => {
      console.log(resp.data);
      this.setState(resp.data);
      this.setState({attemptingInmateId: false});
    }).catch(err => {
      // TODO
    })
  }

  render() {
    console.log('rendering with state', this.state);

    let error_list = null;
    if (false) {
      error_list = <ul className="errorlist">
        <li>{}</li>
        <li>{}</li>
      </ul>
    }

    if (this.state.attemptingInmateId) {
      return <form onSubmit={this.submitInmateIdHandler.bind(this)}>
        <div className="fieldWrapper">
          Inmate ID: <input type="text" value={this.state.inmate_id}
                            onChange={this.handleChange.bind(this, 'inmate_id')}/>
        </div>
        <input type="submit" />
      </form>
    }
    else {
      return <div>
        {error_list}

        <div id="searchBoxLeft">
          <div className="fieldWrapper">
            First name: <input type="text" value={this.state.first_name}
                               onChange={this.handleChange.bind(this, 'first_name')}/>
            <p className="note">Do not use - or ' characters</p>
          </div>
          <div className="fieldWrapper">
            Last name: <input type="text" value={this.state.last_name}
                              onChange={this.handleChange.bind(this, 'last_name')}/>
          </div>
        </div>
        <div id="searchBoxRight">
          <div className="fieldWrapper">
            Inmate ID: <input type="text" value={this.state.inmate_id}
                              onChange={this.handleChange.bind(this, 'inmate_id')}/>
          </div>
          <div className="fieldWrapper">
            Facility: <select type="text" value={this.state.facility}
                             onChange={this.handleChange.bind(this, 'facility')}>
            {/* TODO make the list of options <option value=facilityPk>facility name</option> */}
          </select>
          </div>
        </div>
        <div className="formfooter">
          <input type="submit" value="Add New Record" onClick={this.submitHandler.bind(this)}/>
        </div>
      </div>;
    }
  }
}

const container = document.getElementById('inmateAddFormComponent');
if(container) {
  ReactDOM.render(<InmateAddForm />, container);
}
