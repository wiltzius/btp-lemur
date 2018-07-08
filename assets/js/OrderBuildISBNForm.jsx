import React from 'react';
import orderCache from "./lib/orderCache";
import {Form, Button, Input} from 'semantic-ui-react';

export default class OrderBuildISBNForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null,
      isbn: ''
    };
  }

  componentDidMount() {
    this.orderUnsub = orderCache.sub(order => {
      this.setState({order: order, loading: false});
    });
  }

  componentWillUnmount() {
    this.orderUnsub();
  }

  submit(event) {
    event.preventDefault();
    // todo client side validation of ISBN formatting
    this.props.setError([]);
    orderCache.addBookISBN(this.state.isbn).catch(err => {
      this.props.setError(err);
    });
  }

  setISBN(event) {
    this.setState({isbn: event.target.value});
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return <Form onSubmit={this.submit.bind(this)}>
      <Form.Group>
        <Form.Field width={10}>
          <label>Add book by ISBN:</label>
          <Input type="text"
                 name="ISNB"
                 onChange={this.setISBN.bind(this)}/>
        </Form.Field>
        <Button type="submit">Add to Order</Button>
      </Form.Group>
    </Form>
  }
}
