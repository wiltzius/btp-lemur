import React from 'react';
import orderCache from "./lib/orderCache";

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
    return <form id="TitleForm" onSubmit={this.submit.bind(this)}>
      <div className="bookSearchBox">
        <input type="hidden" name="whichForm" value="title" />
        <div className="bookSearchLeft">
          <div>Add by Title</div>
        </div>
        <div className="bookSearchRight">
          <div>
            <label htmlFor="customFormTitle">Title: </label>
            <input id="customFormTitle" type="text" name="ISBN" onChange={this.setTitle.bind(this)}/>
          </div>
          <input type="submit" value="Add to Order" />
        </div>
      </div>
    </form>;
  }
}
