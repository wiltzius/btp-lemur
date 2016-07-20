import * as React from 'react';
import _ from 'lodash';

export default class InmateSearchWarnings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  inmateDictionaries() {
    // TODO filter orders less than 5 years old
    // TODO filter dictionary title case-insensitive
    //.filter(o => moment(o.attributes.date_closed).isAfter(moment().subtract(5, 'years')))    // TODO use moment for date comparison
    return _(this.props.inmate.includes.order_set)
        .filter(o => o.attributes.status == 'SENT')
        .map('includes.book_set')
        .flatten()
        .filter(el => _.includes(el.attributes.title, 'dictionary'))   // TODO
        .value()
  }

  singleDictionaryWarning() {
    return <li>Patron already received dictionary "{this.inmateDictionaries()[0].attributes.title}"</li>
  }

  toggleMultiDictionaryWarning() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  multiDictionaryWarning() {
    return <li>
      Patron has already received multiple dictionaries.
      <a onClick={this.toggleMultiDictionaryWarning.bind(this)}>Click to expand.</a>
      <ul className="dictionaries" style={{display: this.state.expanded ? 'initial' : 'none'}}>
        {this.inmateDictionaries().map(d => <li key={d.id}>{d.attributes.title}</li>)}
      </ul>
    </li>
  }

  render() {
    return <span>
      <ul className="inmateErrors error">
        {this.inmateDictionaries().length == 1 ? this.singleDictionaryWarning() : null}
        {this.inmateDictionaries().length > 1 ? this.multiDictionaryWarning() : null}
      </ul>
    </span>
  }

}
