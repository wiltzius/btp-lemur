import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Modal from 'react-modal';

export default class InmateAddForm extends React.Component {

  constructor() {
    super();

    this.state = {
      modalIsOpen: false
    };
  }

  handleChange(event) {
    this.setState({
      firstName: event.target.value
    });
  }

  render() {
    return <div>
      <ul className="errorlist">
        <li>{}</li>
        <li>{}</li>
      </ul>

      <div id="searchBoxLeft">
        <div className="fieldWrapper">
          First name: <input type="text" value={this.state.firstName}/>
          <p className="note">Do not use - or ' characters</p>
        </div>
        <div className="fieldWrapper">
          Last name: <input type="text"/>
        </div>
      </div>
      <div id="searchBoxRight">
        <div className="fieldWrapper">
          Inmate ID: <input type="text"/>
        </div>
        <div className="fieldWrapper">
          Facility: <input type="text"/>
        </div>
        <div className="fieldWrapper" id="addressWrapper">
          Address: <input type="text"/>
        </div>
      </div>
      <div className="formfooter">
        <input type="submit" value="Add New Record"/>
      </div>
    </div>
  }
}

ReactDOM.render(<InmateAddForm />, document.getElementById('inmateAddFormComponent'));
