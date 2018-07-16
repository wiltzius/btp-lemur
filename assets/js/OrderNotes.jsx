import React from 'react';
import coreapi from './lib/coreapi';
import {Button, Icon, Form, Input, TextArea} from 'semantic-ui-react';

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
      'notes': event.target.value,
      'sent': false
    });
  }

  render() {
    return <Form onSubmit={this.formSubmit.bind(this)}>
      <Form.Field>
        <label>
          Order notes:
        </label>
        <TextArea value={this.state.notes}
                  onChange={this.inputChanged.bind(this)}/>
      </Form.Field>
      <Button type="submit"
              primary
              loading={this.state.sending}>
        Save &nbsp;{this.state.sent ? <Icon name='checkmark' /> : null}
      </Button>
      {/*{this.state.sent ? <Icon name='checkmark' /> : null}*/}
    </Form>
  }
}
