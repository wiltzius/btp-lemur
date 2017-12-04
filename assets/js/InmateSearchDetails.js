import React from 'react';
import If from 'jsx-control-statements';
import {stringBook, unorderedList} from "./lib/util";
import InmateSearchOrderHistory from "./InmateSearchOrderHistory";
import {Link, withRouter} from "react-router-dom";
import orderCache from "./lib/orderCache";
import InmateSearchProxy from "./InmateSearchProxy";
import InmateDOCLink from "./InmateDOCLink";
import {Label, List, Item, Message, Button} from 'semantic-ui-react';

class InmateSearchDetails extends React.PureComponent {

  dictWarning(inmate) {
    if (inmate.dictionaries.length === 1) {
      return <li>Patron already received dictionary ({inmate.dictionaries[0]})</li>
    }
    else if (inmate.dictionaries.length > 1) {
      return <li>Patron has already received multiple dictionaries.
        <a href="javascript:$('#inmateResult{ inmate.pk } .dictionaries').toggle('fast');">Click to expand</a>
        <ul class="dictionaries"
            style="display:none;">
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

    return <Item>
      <Item.Content>
        {/* todo maybe inmate images? */}
        <Item.Header>{inmate.full_name}</Item.Header>


        {/* Inmate DOC details box */}
        {/*<InmateSearchProxy inmatePk={inmate.id}/>*/}

        {/*Inmate data from Lemur */}
        <Item.Meta>
          Latest DOC info goes here.
          <InmateDOCLink linkText="Inmate DOC lookup"
                         inmate={inmate}/>
        </Item.Meta>


        <Item.Extra>
          {_.map(inmate.warnings, w => <Label key={w}
                                              basic
                                              color="red">{w}</Label>)}
        </Item.Extra>

        <Item.Description>
          {/* -- dictionary and other warnings */}
          {/*<Message error*/}
          {/*list={inmate.warnings}/>*/}
          <List>
            <List.Item>
              <span className="resultLabel">Inmate ID:</span> <span className="resultValue">{inmate.inmate_id}</span>
            </List.Item>
            <List.Item>
              <span className="resultLabel">Facility:</span> <span className="resultValue">{inmate.facility.name}</span>
              <If condition={inmate.facility.otherRestrictions}>
                <span> ({inmate.facility.otherRestrictions})</span>
              </If>
            </List.Item>
            <If condition={inmate.address}>
              <List.Item>
                <span className="resultLabel">Address:</span><span className="resultValue">{inmate.address} </span>
              </List.Item>
            </If>
          </List>
          {/*<li>*/}
          {/*<Link to={"/inmate/add/" + inmate.id}>Edit Information</Link>*/}
          {/*</li>*/}
          {/*<li>*/}
          {/*<a onClick={evt => this.newOrder(inmate.id)}*/}
          {/*className="bold">Start a new order for this inmate</a>*/}
          {/*</li>*/}
          {/*</Item.Description>*/}
          {/*<Item.Description>*/}
          <InmateSearchOrderHistory inmate={inmate}/>
        </Item.Description>
        <Item.Extra>
          <Button primary
                  floated="right"
                  onClick={evt => this.newOrder(inmate.id)}>Start a new order</Button>
          <Button floated="right" as={Link} to={"/inmate/add/" + inmate.id}>Edit Information</Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  }
}

export default withRouter(InmateSearchDetails)
