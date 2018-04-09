import coreapi from "./coreapi";
import $ from "jquery";
import _ from 'lodash';

class OrderCache {

  constructor() {
    this.subs = new Set();
    this.order = null;
    this._cached_request = null;
  }

  _load() {
    // todo if we're hitting the server too often, debounce the reloading behavior to at most once a second or something
    if (!this._cached_request) {
      this._cached_request = $.getJSON('/lemur/order/current/')
          .then(order => {
            if (_.isEmpty(order)) {
              order = null;
            }
            this._set(order);
          }).catch(err => {
            console.log(err);
          }).then(() => {
            this._cached_request = null;
          });
    }
  }

  _set(order) {
    this.order = order;
    this.subs.forEach(s => s(order));
  }

  sub(fn) {
    const idx = this.subs.length;
    this.subs.add(fn);
    if (this.order) {
      fn(this.order);
    }
    this._load();

    // return an unsubscribe function
    return () => {
      this.subs.delete(fn);
    }
  }

  refresh() {
    this._load();
  }

  addBookISBN(isbn) {
    return coreapi.boundAction(['book_create_isbn', 'create'], {
      asin: isbn,
      order_id: this.order.id
    }).then(() => {
      this.refresh()
    }).catch(err => {
      console.error(err);
    })
    // return $.post('/lemur/order/addbook/ISBN/', {
    //   ISBN: isbn
    // }).then(() => {
    //   this.refresh();
    // }).catch(err => {
    //   if (err.status === 400) {
    //     return $.Deferred().reject("It looks like the ISBN you tried isn't a valid ISBN number (usually 10 or 13 " +
    //         "digits, with a correct check digit), try re-typing it or try another method for adding the book to this " +
    //         "order");
    //   }
    //   else if (err.status === 404) {
    //     return $.Deferred().reject("No results found for the ISBN you entered, please verify that it was typed " +
    //         "correctly, or try another method for adding the book to this order");
    //   }
    //   console.log(err);
    // });
  }

  addBookCustom(title, author) {
    coreapi.boundAction(['books', 'create'], {
      title,
      author,
      order_id: this.order.id
    }).then(() => {
      this.refresh();
    }).catch(err => {
      // todo real error handling
      console.log(err);
    });
  }

  removeBook(book) {
    coreapi.boundAction(['books', 'delete'], {id: book.id})
        .catch(err => {
          // the coreapi library throws a TypeError on deletes because the server doesn't return a content-header, just ignore
          if(err.name === 'TypeError') {
            return;
          }
          return Promise.reject(err);
        })
        .then(() => {
          this.refresh();
        })
        .catch(err => {
          console.log(err);
        })
  }

  createOrder(inmate_id) {
    return coreapi.client.action(coreapi.schema, ['orders', 'create'], {
      inmate_id,
      status: 'OPEN'
    })
  }

  setOrder(order_id) {
    return $.get(`/lemur/order/set/${order_id}/`).then(new_order => this._set(new_order))
  }

  unsetOrder() {
    return $.get(`/lemur/order/unset/`).then(() => this._set(null))
  }

  reopenOrder(order_id) {
    return $.get(`/lemur/order/reopen/${order_id}/`).then(new_order => this.refresh(new_order))
  }

  createAndSetOrder(inmate_id) {
    return this.createOrder(inmate_id).then(new_order => this.setOrder(new_order.id))
  }
}

export default new OrderCache();
