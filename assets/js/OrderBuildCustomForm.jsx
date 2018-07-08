import React from 'react';
import orderCache from "./lib/orderCache";
import {Form, Button, Input} from 'semantic-ui-react';

export default class OrderBuildCustomForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null,
      title: ''
    };
  }

  componentDidMount() {
    this.orderUnsub = orderCache.sub(order => {
      this.setState({order: order});
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    this.orderUnsub();
  }

  submit(event) {
    event.preventDefault();
    // todo client side validation of ISBN formatting
    orderCache.addBookCustom(this.state.title);
  }

  setTitle(event) {
    this.setState({title: event.target.value});
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return <Form onSubmit={this.submit.bind(this)}>
      <Form.Group>
        <Form.Field width={10}>
          <label>Add by title:</label>
          <Input type="text" name="title" onChange={this.setTitle.bind(this)}/>
        </Form.Field>
        <Button type="submit">Add to Order</Button>
      </Form.Group>
    </Form>;
  }
}
