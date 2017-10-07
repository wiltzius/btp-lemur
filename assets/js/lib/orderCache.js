import coreapi from "./coreapi";

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
      _.each(this.subs, s => s(order))
    }).catch(err => {
      console.log(err);
    });
  }

  sub(fn) {
    this.subs.push(fn);
    if(this.order) {
      fn(this.order);
    }
    this._load();
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
      // todo real error handling
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

}

export default new OrderCache();