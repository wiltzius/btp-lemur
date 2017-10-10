import React from 'react';
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
    // todo make this AJAX and then a router navigate, not a hard navigate
    window.location = `/lemur/order/reopen/${this.props.orderPk }/`;
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
