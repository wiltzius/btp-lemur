import coreapi from "./coreapi";
import $ from "jquery";
import _ from 'lodash';

class OrderCache {

  constructor() {
    this.subs = [];
    this.order = null;
  }

  _load() {
    $.getJSON('/lemur/order/current/').then(resp => {
      const order_id = resp.current_order_id;
      if(order_id) {
        return coreapi.client.action(coreapi.schema, ['orders', 'read'], {id: order_id});
      }
      return null;
    }).then(order => {
      _.each(this.subs, s => s ? s(order) : null);
    }).catch(err => {
      console.log(err);
    });
  }

  sub(fn) {
    const idx = this.subs.length;
    this.subs[idx] = fn;
    if(this.order) {
      fn(this.order);
    }
    this._load();

    // return an unsubscribe function
    return () => {
      delete this.subs[idx];
    }
  }

  refresh() {
    this._load();
  }

  addBookISBN(isbn) {
    return $.post('/lemur/order/addbook/ISBN/', {
      ISBN: isbn
    }).then(() => {
      this.refresh();
    }).catch(err => {
      if(err.status === 400) {
        return $.Deferred().reject("It looks like the ISBN you tried isn't a valid ISBN number (usually 10 or 13 " +
          "digits, with a correct check digit), try re-typing it or try another method for adding the book to this " +
          "order");
      }
      else if(err.status === 404) {
        return $.Deferred().reject("No results found for the ISBN you entered, please verify that it was typed " +
          "correctly, or try another method for adding the book to this order");
      }
      console.log(err);
    });
  }

  addBookCustom(title, author) {
    return $.post('/lemur/order/addbook/custom/', {
      Title: title,
      Author: author
    }).then(() => {
      this.refresh();
    }).catch(err => {
      // todo real error handling
      console.log(err);
    });
  }

  removeBook(book) {
    $.get('/lemur/order/removebook/' + book.id + '/')
      .then(() => {
        this.refresh();
      })
      .catch(err => {
        console.log(err);
      })
  }

}

export default new OrderCache();