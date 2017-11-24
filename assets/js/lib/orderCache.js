import coreapi from "./coreapi";
import $ from "jquery";
import _ from 'lodash';

class OrderCache {

  constructor() {
    this.subs = [];
    this.order = null;
  }

  _load() {
    // todo cache outstanding api calls so we don't issue multiple
    // todo throttle the reloading behavior so its at most once a second or something
    $.getJSON('/lemur/order/current/')/*.then(order => {
      const order_id = resp.current_order_id;
      if(order_id) {
        return coreapi.client.action(coreapi.schema, ['orders', 'read'], {id: order_id});
      }
      return null;
    })*/.then(order => {
      if(_.isEmpty(order)) {
        order = null;
      }
      this._set(order);
    }).catch(err => {
      console.log(err);
    });
  }

  _set(order) {
    this.order = order;
    _.each(this.subs, s => s ? s(order) : null);
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

  createOrder(inmate_id) {
    return coreapi.client.action(coreapi.schema, ['orders', 'create'], {
      inmate_id,
      status: 'OPEN'
    })
  }

  setOrder(order_id) {
    // todo make order set just return the new order to avoid this round-trip... or just use from createOrder, in that case
    return $.get(`/lemur/order/set/${order_id}/`).then(() => this.refresh())
  }

  unsetOrder() {
    // todo make order set just return the new order to avoid this round-trip... or just use from createOrder, in that case
    return $.get(`/lemur/order/unset/`).then(() => this._set(null))
  }

  createAndSetOrder(inmate_id) {
    return this.createOrder(inmate_id).then(new_order => this.setOrder(new_order.id))
  }
}

export default new OrderCache();