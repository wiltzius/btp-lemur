import React from 'react';
import orderCache from "./lib/orderCache";

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
    return <form id="ISBNForm" onSubmit={this.submit.bind(this)}>
      <div className="bookSearchBox">
        <div className="bookSearchLeft">
          <div>Add book by ISBN</div>
        </div>
        <div className="bookSearchRight">
          <div>
            <label htmlFor="isbn_form_isbn">ISBN: </label>
            <input id="isbn_form_isbn" type="text" name="ISBN" onChange={this.setISBN.bind(this)}/>
          </div>
          <input type="submit" value="Add to Order"/>
        </div>
      </div>
    </form>
  }
}
