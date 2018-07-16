import React from 'react';
import coreapi from './lib/coreapi';
import OrderCompleteSummarySnippet from "./OrderCompleteSummarySnippet";
import OrderNotes from "./OrderNotes";
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import {Button} from 'semantic-ui-react';

export default withRouter(class OrderDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      order: null
    };
  }

  componentDidMount() {
    const order_id = this.props.match.params.order_id;
    if (!order_id) {
      this.setState({loading: false});
    }
    else {
      coreapi.client.action(coreapi.schema, ['orders', 'read'], {id: order_id}).then(res => {
        this.setState({order: res, loading: false});
      }).catch(err => {
        console.log(err)
      });
    }
  }

  orderSentSnippet() {
    if (this.state.order.status === 'SENT') {
      return <p>
        <span className="orderHeader">Order #{this.state.order.id}</span> marked as sent, please ensure it is
        delivered to the packing station.
      </p>
    }
  }

  printInvoiceButton() {
    if (this.state.order.status === 'SENT') {
      return <Button icon="print"
                     content="Print Invoice"
                     size="tiny"
                     as={'a'}
                     href={"/lemur/order/invoice/" + this.state.order.id}
                     target="_blank"
                     style={{float: 'right'}}/>

    }
  }

  render() {
    if (this.state.loading === true) {
      return <div>Loading...</div>
    }
    else if (this.state.order === null) {
      return <p>
        This page shows a historical order's details (not the current order). To see an old order's details,&nbsp;
        <Link to="/inmate/search">find the inmate</Link> and then click on the order in their history.
      </p>
    }
    else {
      return <div>
        <h3>
          Order details
          {/* todo why does this have to be inside the h3 to look right */}
          {this.printInvoiceButton()}
        </h3>
        {this.orderSentSnippet()}
        <OrderCompleteSummarySnippet order={this.state.order}/>
        <OrderNotes order={this.state.order}/>
      </div>
    }
  }
})
