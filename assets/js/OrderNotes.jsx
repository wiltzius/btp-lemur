import React from 'react';
import coreapi from './lib/coreapi';

export default class OrderNotes extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notes: props.order.notes,
      sending: false,
      sent: false
    };
  }

  formSubmit(event) {
    event.preventDefault();
    this.setState({sending: true});
    return coreapi.client.action(coreapi.schema, ['orders', 'partial_update'], {
      id: this.props.order.id,
      notes: this.state.notes
    }).then(() => {
      this.setState({sending: false, sent: true});
    }).catch(err => {
      // todo have somewhere global to put errors
      this.setState({sending: false, sent: false});
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
        <span>{this.state.sending ? 'saving...' : ''}</span>
        <span>{this.state.sent ? 'saved!' : ''}</span>
      </form>
    </div>
  }
}
