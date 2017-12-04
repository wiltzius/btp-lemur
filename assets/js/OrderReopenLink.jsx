import React from 'react';
import Modal from 'react-modal';
import OrderCache from './lib/orderCache';
import {withRouter} from 'react-router-dom';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)'
  }
};

export default withRouter(class OrderReopenLink extends React.Component {

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
    // window.location = `/lemur/order/reopen/${this.props.orderPk }/`;
    OrderCache.reopenOrder(this.props.orderPk).then(() => {
      this.props.history.push('/order/build');
    });
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
});
