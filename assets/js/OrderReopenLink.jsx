import React from 'react';
import classNames from 'classnames';

export default class OrderReopenLink extends React.Component {

  constructor() {
    super();
    this.triggerAlert = this.triggerAlert.bind(this);
  }

  triggerAlert() {
    console.log(this.props.orderHref);
    if(window.confirm('Do you want to reopen the order?')) {
      window.location = this.props.orderHref;
    }
  };

  render() {
    //console.log(this.props.orderHref);

    return <a onClick={this.triggerAlert}>reopen</a>
  }
}
