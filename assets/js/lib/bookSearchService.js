import _ from 'lodash';
import $ from 'jquery';

class BookSearchService {

  constructor() {
    this.subs = [];
    this.results = null;
    this._params = {
      title: null,
      author: null,
      page: 1
    }
  }

  _load() {
    if(!this._params.title && !this._params.author) {
      return;
    }
    $.get('/lemur/order/booksearch/', {
      author: this._params.author,
      title: this._params.title,
      page: this._params.page
    }).then(resp => {
      _.each(this.subs, s => s(resp))
    }).catch(err => {
      console.log(err);
    });
  }

  sub(fn) {
    this.subs.push(fn);
    this._load();
  }

  search(title, author, page=1) {
    this._params = {title, author, page};
    this._load();
  }

  searchPage(page) {
    this._params.page = page;
    this._load();
  }

}

export default new BookSearchService();