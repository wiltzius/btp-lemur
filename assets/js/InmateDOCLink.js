import * as React from "react";
import {INMATE_TYPES} from "./lib/inmate";

// Arguments :
//  verb : 'GET'|'POST'
//  target : an optional opening target (a name, or "_blank"), defaults to "_self"
const postOpen = function (verb, url, data, target) {
  var form = document.createElement("form");
  form.action = url;
  form.method = verb;
  form.target = target || "_self";
  if (data) {
    for (var key in data) {
      var input = document.createElement("textarea");
      input.name = key;
      input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
      form.appendChild(input);
    }
  }
  form.style.display = 'none';
  document.body.appendChild(form);
  form.submit();
};

class FederalLink extends React.PureComponent {
  render() {
    return <span>
      No DOC link for Federal inmates; manually search <a target="_blank" href="https://www.bop.gov/inmateloc/">here</a>
    </span>
  }

}

class IllinoisLink extends React.PureComponent {

  click() {
    return postOpen('POST', "http://www.idoc.state.il.us/subsections/search/ISinms2.asp", {
      selectlist1: "selected",
      idoc: this.props.inmate.inmate_id_formatted
    }, "_blank");
  }

  render() {
    return <a onClick={this.click.bind(this)}>{this.props.linkText}</a>
  }
}


class KentuckyLink extends React.PureComponent {
  render() {
    return <a target="_blank"
              href={"http://kool.corrections.ky.gov/KOOL/Details/" + this.props.inmate.inmate_doc_id}>this.props.linkText</a>
  }
}


export default class InmateDOCLink extends React.Component {

  render() {
    const inmate = this.props.inmate;
    switch (inmate.inmate_type) {
      case INMATE_TYPES.FEDERAL:
        return <FederalLink {...this.props}/>;
      case INMATE_TYPES.ILLINOIS:
        return <IllinoisLink {...this.props} />;
    }
    return <span></span>
  }

}
