import React from 'react';
import classNames from 'classnames';

export default class InmateSearchProxy extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      parole_single: 'loading...',
      parent_institution: 'loading...'
    }
  }

  oldParoledDate() {
    if (this.state.parole_single) {
      const today = new Date();
      const parole_date = new Date(this.state.parole_single);
      if (parole_date.getTime() < today.getTime()) {
        return true;
      }
    }
    return false;
  }

  componentDidMount() {
    $.get('/lemur/inmate_search_proxy/' + this.props.inmatePk, (results) => {
      console.log(results);
      this.setState({
        parole_single: results.parole_single || '--',
        parent_institution: results.parent_institution || "unknown"
      });
    }, "json");
  }

  render() {
    console.log(this.props.inmatePk);
    const paroleClasses = classNames({
      'docLabel': true,
      'error': this.oldParoledDate()
    });

    return <ul className="inmateDOC">
      <h4>Current DOC/FBOP Records</h4>
      <li>
        <span className={paroleClasses}>Parole/release date:</span>
        <span className="docValue">{this.state.parole_single}</span>
      </li>
      <li>
        <span className="docLabel">Parent institution:</span>
        <span className="docValue">{this.state.parent_institution}</span>
      </li>
    </ul>
  }
}
