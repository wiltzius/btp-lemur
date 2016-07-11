import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
};

export default class OrderReopenLink extends React.Component {

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.navigate = this.navigate.bind(this);
    this.state = {
      modalIsOpen: false
    };
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  navigate() {
    window.location = this.props.orderHref;
  }

  render() {
    return <span>
      <a onClick={this.openModal}>reopen</a>
      <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}>

        <h3>Are you sure?</h3>
        <p>We don't typically reopen orders.</p>
        <button onClick={this.navigate} style={{marginRight: '1em'}}>Reopen</button>
        <button onClick={this.closeModal}>Cancel</button>
      </Modal>
      </span>
  }
}

const alert_link_containers = document.querySelectorAll('.orderReopenLink');
Array.from(alert_link_containers).forEach((el) => {
  const order_href = el.attributes["data-order-href"].value;
  ReactDOM.render(<OrderReopenLink orderHref={order_href} />, el);
});