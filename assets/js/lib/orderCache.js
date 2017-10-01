import coreapi from "./coreapi";

class OrderCache {

  constructor() {
    this.subs = [];
  }

  _notify() {
    _.each(this.subs, fn => {
      fn(this._order);
    })
  }

  sub(fn) {
    this.subs.push(fn);

    if(this._order) {
      // cache by default
      fn(this._order);
    }
    const resp = await $.getJSON('/lemur/order/current/');
    const order_id = resp.current_order_id;
    if (order_id) {
      this._order = await coreapi.client.action(coreapi.schema, ['orders', 'read'], {id: order_id});
      return this._order;
    }
    else {
      return null;
    }
  }

  clear() {
    this._order = null;
  }

}

class OrderCache2 {

  constructor() {
    this._order = Observable.create(observer => {
      // todo kickoff a load of the value from the server, and when that returns then call .next on the observable
    });
  }

  sub(fn) {
    this._order.subscribe(fn);
    // newOrder =>{
    //   fn(newOrder);
    // })
  }

}

export default new OrderCache();