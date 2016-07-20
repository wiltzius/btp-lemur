import React from 'react';
import InmateSearchProxy from './InmateSearchProxy';
import InmateSearchOrderHistory from './InmateSearchOrderHistory';
import InmateSearchWarnings from './InmateSearchWarnings';
import {Link} from 'react-router';

export default class InmateSearchResult extends React.Component {

  otherRestrictions(inmate) {
    if (inmate.includes.facility.attributes.otherRestrictions) {
      return <li>
        <span className="resultLabel">Restrictions:</span>
        <span className="resultValue">{inmate.includes.facility.attributes.otherRestrictions}</span>
      </li>
    }
    else {
      return null;
    }
  }
  
  render() {
    const inmate = this.props.inmate;
    return <div className="inmateResult">
      <h3>{inmate.attributes.first_name} {inmate.attributes.last_name}</h3>

      <InmateSearchWarnings inmate={inmate} />
      
      <InmateSearchProxy inmatePk={inmate.pk}/>

      <ul className="inmateDetails">
        <li>
          <span className="resultLabel">Inmate ID:</span><span className="resultValue">{inmate.attributes.inmate_id}</span>
        </li>
        <li>
          <span className="resultLabel">Facility:</span><span className="resultValue">{inmate.includes.facility.attributes.name}</span>
        </li>
        {this.otherRestrictions(inmate)}
      </ul>

      <ul className="inmateHistory">
        <li>{/* TODO inmate DOC link */}Inmate DOC link</li>
        <li><InmateSearchOrderHistory orderSet={inmate.includes.order_set} /></li>
        <li><Link to="/app/inmate/edit">Edit Information</Link></li>
        <li><Link to="/app/order/create" className="bold">Start a new order for this inmate</Link></li>
      </ul>
    </div>

  }
}
