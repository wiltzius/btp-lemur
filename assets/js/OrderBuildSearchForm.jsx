import React from 'react';
import * as $ from 'jquery';
import {Button, Form, Input, Search} from 'semantic-ui-react';
import orderCache from "./lib/orderCache";

export default class OrderBuildSearchForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      searchResults: null,
    };
  }

  componentDidMount() {
    if (window.location.hash) {
      // todo this does not still work
      this.setState({title: window.location.hash.slice(1)}, () => {
        this.search();
      });
    }
  }

  searchCallback(resp) {
    this.setState({
      searching: false,
      searchResults: resp.books.map(book => {
        return {
          title: book.title,
          description: book.author,
          id: book.isbn,
          key: [book.isbn, book.author, book.title].join('-')
        }
      })
    });
  }

  onSearchChange(_event, searchBox) {
    if (!searchBox.value) {
      this.setState({
        searching: false,
        searchResults: []
      })
    } else {
      this.setState({
        searching: true,
        searchValue: searchBox.value
      }, () => {
        $.get('/lemur/order/booksearch/', {
          query: this.state.searchValue
        }).then(this.searchCallback.bind(this))
        // todo error handling
      });
    }
  }

  onResultSelect(_event, data) {
    orderCache.addBookISBN(data.result.id);
  }

  render() {
    return <Form>
      <Form.Field>
        <label>Search for a book:</label>
        <Search onSearchChange={this.onSearchChange.bind(this)}
                onResultSelect={this.onResultSelect.bind(this)}
                results={this.state.searchResults}
                loading={this.state.searching}/>
      </Form.Field>
    </Form>
  }
}
