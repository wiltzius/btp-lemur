import React from 'react';
import orderCache from "./lib/orderCache";
import bookSearchService from "./lib/bookSearchService";

export default class OrderBuildSearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null,
      title: null,
      author: null,
    };
  }

  componentDidMount() {
    orderCache.sub(order => {
      this.setState({order: order});
      this.setState({loading: false});
    });
    if(window.location.hash){
      this.setState({title: window.location.hash.slice(1)}, () => {
        this.search();
      });
    }
  }

  updateInput(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  search() {
    bookSearchService.search(this.state.title, this.state.author);
  }

  submit(event) {
    event.preventDefault();
    this.search();
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>
    }
    return <form onSubmit={this.submit.bind(this)}>
      <div className="bookSearchBox">
        <input type="hidden" name="whichForm" value="search"/>
        <div className="bookSearchLeft">
          Search for books to add
        </div>
        <div className="bookSearchRight">
          <div>
            <label htmlFor="bookSearchTitle">Title: </label>
            <input type="text" id="bookSearchTitle" name="title" onChange={this.updateInput.bind(this)}/>
          </div>
          <div>
            <label htmlFor="bookSearchAuthor">Author: </label>
            <input type="text" id="bookSearchAuthor" name="author" onChange={this.updateInput.bind(this)}/>
          </div>
          <input type="submit" value="Search"/>
        </div>
      </div>
    </form>
  }
}
