// import './InmateSearchProxy';
import React from 'react';
import If from 'jsx-control-statements';
import {stringBook, unorderedList} from "./lib/util";
import InmateSearchOrderHistory from "./InmateSearchOrderHistory";
import {Link, withRouter} from "react-router-dom";
import orderCache from "./lib/orderCache";
import InmateSearchProxy from "./InmateSearchProxy";
import InmateDOCLink from "./InmateDOCLink";

// import InmateSearchProxy from "./InmateAddEditForm";

class InmateSearchDetails extends React.Component {

  dictWarning(inmate) {
    if (inmate.dictionaries.length === 1) {
      return <li>Patron already received dictionary ({inmate.dictionaries[0]})</li>
    }
    else if (inmate.dictionaries.length > 1) {
      return <li>Patron has already received multiple dictionaries.
        <a href="javascript:$('#inmateResult{ inmate.pk } .dictionaries').toggle('fast');">Click to expand</a>
        <ul class="dictionaries" style="display:none;">
          {unorderedList(inmate.dictionaries.map(d => stringBook(d)))}
        </ul>
      </li>
    }
  }

  newOrder(inmate_id) {
    orderCache.createAndSetOrder(inmate_id).then(() => {
      this.props.history.push('/order/build');
    });
  }

  render() {
    const inmate = this.props.inmate;

    return <div className="inmateResult" id="inmateResult{{ inmate.pk }}">
      <h3>{inmate.full_name}</h3>

      {/* -- dictionary and other warnings */}
      <ul className="inmateErrors error">
        {unorderedList(inmate.warnings)}
      </ul>

      {/* Inmate DOC details box */}
      <InmateSearchProxy inmatePk={inmate.id} />

      {/*Inmate data from Lemur */}
      <ul className="inmateDetails">
        <li><span className="resultLabel">Inmate ID:</span><span className="resultValue">{inmate.inmate_id}</span>
        </li>
        <li>
          <span className="resultLabel">Facility:</span><span className="resultValue">{inmate.facility.name}</span>
          <If condition={inmate.facility.otherRestrictions}>
            <span>({inmate.facility.otherRestrictions})</span>
          </If>
        </li>

        <If condition={inmate.address}>
          <li>
            <span className="resultLabel">Address:</span><span className="resultValue">{inmate.address} </span>
          </li>
        </If>
      </ul>
      <ul className="inmateHistory">
        <li><InmateDOCLink linkText="Inmate DOC lookup" inmate={inmate}/></li>
        <InmateSearchOrderHistory inmate={inmate}/>
        <li>
          <Link to={"/inmate/add/" + inmate.id}>Edit Information</Link>
        </li>
        <li>
          <a onClick={evt => this.newOrder(inmate.id)} className="bold">Start a new order for this inmate</a>
        </li>
      </ul>
    </div>
  }
}

export default withRouter(InmateSearchDetails)
