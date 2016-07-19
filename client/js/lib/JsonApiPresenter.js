import * as _ from 'lodash';
export default class JsonApiPresenter {

  constructor(item, state) {
    this._item = item;
    this._state = state;
  }

  static fromId(type, id, state) {
    const item = _.find(state.api[type].data, {id: id});
    if (!item) {
      console.error(`Could not find Json API entity of type ${type} with id ${id} -- has it been loaded either
        explicitly or via include?`);
    }
    return new this(item, state);
  }

  get attributes() {
    return this._item.attributes;
  }

  get id() {
    return this._item.id;
  }

  get type() {
    return this._item.type;
  }

  get includes() {
    return _.mapValues(this._item.relationships, rel => {
      if (_.isArray(rel.data)) {
        return _.map(rel.data, datum => JsonApiPresenter.fromId(datum.type, datum.id, this._state));
      }
      else {
        return JsonApiPresenter.fromId(rel.data.type, rel.data.id, this._state);
      }
      // TODO will rel ever be null, undefined, or missing `data`?
    });
  }

}
