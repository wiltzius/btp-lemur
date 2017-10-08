import React from 'react';
import orderCache from "./lib/orderCache";
import bookSearchService from "./lib/bookSearchService";
import _ from 'lodash';

export default class OrderBuildSearchResults extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      results: null
    }
  }

  componentDidMount() {
    bookSearchService.sub(results => {
      this.setState({results})
    })
  }

  pagination(res) {
    return <div className="pagination">
      <span>Page {res.currPage} of {res.totalPages}: </span>
      {res.prevPage > 0 ?
        <a onClick={evt => bookSearchService.searchPage(res.prevPage)}>&lt; previous</a>
        : '< previous'}
      <span> | </span>
      {res.nextPage <= res.totalPages ?
        <a onClick={evt => bookSearchService.searchPage(res.nextPage)}>next &gt;</a>
        : 'next >'}
    </div>
  }

  errors() {
    if (this.state.results.errors) {
      return <div>
        {this.state.results.errors.map(err => <p key={err} className="error">{err}</p>)}
      </div>;
    }
    else {
      return <div/>
    }
  };

  render() {
    if (!this.state.results) {
      return <div/>;
    }
    const res = this.state.results;
    return <div>
      {this.errors()}
      <div>
        <h2>Search Results</h2>
        <div className="resultsPadding">
          <p>If one of the below choices matches the book you want, select it and click "add to current order". If none
            match, try making your search more specific.</p>
        </div>
        {this.pagination(res)}
        <div id="resultsGroup">
          <div id="resultsListing">
            <table>
              <tbody>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>&nbsp;</th>
              </tr>
              {_.map(res.books, (b, idx) =>
                <tr className={idx % 2 === 0 ? 'even' : 'odd'} key={b.isbn}>
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  {res.custom_book === true ?
                    <td className="rightcolumn">
                      <a onClick={evt => orderCache.addBookCustom(b.title, b.author)}>
                        add custom book to order
                      </a>
                    </td>
                    :
                    <td className="rightcolumn">
                      <a onClick={evt => orderCache.addBookISBN(b.isbn)}>add to order</a>
                    </td>
                  }
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
        {this.pagination(res)}
      </div>
    </div>
  }
}
