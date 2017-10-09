// import './InmateSearchProxy';
import React from 'react';
import If from 'jsx-control-statements';
import {stringBook, unorderedList} from "./util";
import InmateSearchOrderHistory from "./InmateSearchOrderHistory";
// import InmateSearchProxy from "./InmateAddEditForm";

export default class InmateSearchDetails extends React.Component {

  dictWarning (inmate) {
    if (inmate.dictionaries.length === 1) {
      return <li>Patron already received dictionary ({inmate.dictionaries[0] })</li>
    }
    else if(inmate.dictionaries.length > 1) {
      return <li>Patron has already received multiple dictionaries.
        <a href="javascript:$('#inmateResult{ inmate.pk } .dictionaries').toggle('fast');">Click to expand</a>
        <ul class="dictionaries" style="display:none;">
          { unorderedList(inmate.dictionaries.map(d => stringBook(d))) }
        </ul>
      </li>
    }
  }

  render() {
    const inmate = this.props.inmate;

    return <div className="inmateResult" id="inmateResult{{ inmate.pk }}">
      <h3>{ inmate.full_name }</h3>

      {/* -- dictionary and other warnings */}
      <ul className="inmateErrors error">
        {unorderedList(inmate.warnings)}
      </ul>

      {/* Inmate DOC details box */}
      {/*<div class="inmateSearchProxyContainer" data-inmate-id="{{ inmate.pk }}"></div>*/}
      {/*<InmateSearchProxy inmate-id={inmate.pk} />*/}

       {/*Inmate data from Lemur */}
      <ul className="inmateDetails">
        <li><span className="resultLabel">Inmate ID:</span><span className="resultValue">{ inmate.inmate_id }</span>
        </li>
        <li>
          <span className="resultLabel">Facility:</span><span className="resultValue">{ inmate.facility.name }</span>
          <If condition={inmate.facility.otherRestrictions}>
            <span>({inmate.facility.otherRestrictions})</span>
          </If>
        </li>

        <If condition={ inmate.address }>
          <li>
            <span className="resultLabel">Address:</span><span className="resultValue">{inmate.address } </span>
          </li>
        </If>
      </ul>
      <ul className="inmateHistory">
        {/*<li>{% inmate_doc_link inmate.pk "Inmate DOC lookup" %}</li>*/}
        <InmateSearchOrderHistory inmate={inmate} />
      </ul>
    </div>
  }

}

