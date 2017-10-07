import coreapi from "./coreapi";

class OrderCache2 {

  constructor() {
    this.subs = []
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
    this._load();
  }

}

export default new OrderCache2();