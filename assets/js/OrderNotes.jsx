import React from 'react';
import coreapi from './coreapi';

export default class OrderNotes extends React.Component {

  constructor(props) {
    super(props);
    console.log('got props', props);
    this.state = {
      notes: props.order.notes
    };
  }

  formSubmit(event) {
    event.preventDefault();
    // todo feedback and error handling for when this saves / if anything goes wrong -- implement global loading indicator?
    return coreapi.client.action(coreapi.schema, ['orders', 'partial_update'], {
      id: this.props.order.id,
      notes: this.state.notes
    }).catch(err => {
      console.log(err);
    })
  }

  inputChanged(event) {
    this.setState({
      'notes': event.target.value
    });
  }

  render() {
    return <div>
      <form onSubmit={this.formSubmit.bind(this)}>
        <label>
          Order notes:<br />
          <textarea value={this.state.notes} onChange={this.inputChanged.bind(this)}/>
        </label><br />
        <input type="submit" value="save"/>
      </form>
    </div>
  }
}
