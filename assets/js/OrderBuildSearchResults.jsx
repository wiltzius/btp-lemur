import React from 'react';
import orderCache from "./lib/orderCache";

export default class OrderBuildSearchResults extends React.Component {

  pagination(res) {
    return <div className="pagination">
      Page {res.currPage} of {res.totalPages}:
      {res.prevPage > 0 ?
        <a href="{% append_to_get page=prevPage %}">&lt; previous</a> : '< previous'}
      |
      {res.nextPage <= res.totalPages ?
        <a href="{% append_to_get page=nextPage %}">next &gt;</a> : 'next &gt;'}
    </div>
  }

  errors() {
    if (this.props.results.errors) {
      return <div>
        {this.props.results.errors.map(err => <p key={err} className="error">{err}</p>)}
      </div>;
    }
    else {
      return <div></div>
    }
  };


  render() {
    console.log('rednering with results', this.props.results);
    if (!this.props.results) {
      return <div/>;
    }
    const res = this.props.results;
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
                  {/*{% endif %}*/}
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
