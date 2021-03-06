import React from 'react';

export default class OrderSummarySnippet extends React.Component {
  // TODO name this an OrderSummary differently

  render() {
    const order = this.props.order;
    if (!order.books) {
      return <p><strong>There are no books in this order. <a href="">Add some</a> before sending it out.</strong></p>
    }
    else {
      return <div>
        <div id="sendReady">
          <h4>Name and Address:</h4>
          <p>{order.inmate.last_name}, {order.inmate.first_name}<br/>
            {order.inmate.address}
          </p>
          <h4>Books:</h4>
          <ul className="sendItems">
            {_.map(order.books, book => {
              return <li key={book.id}>
                <span className="resName">{book.title}</span>{book.author ? <span>by {book.author}</span> : ''}
              </li>
            })}
          </ul>
        </div>
      </div>
    }
  }
}
