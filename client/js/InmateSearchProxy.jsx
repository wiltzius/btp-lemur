import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import axios from 'axios';

export default class InmateSearchProxy extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      parole_single: 'loading...',
      facility_name: 'loading...',
      server_error: false
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
    axios.get('/lemur/inmate_search_proxy_pk/' + this.props.inmatePk).then(res => {
      console.log('in here');
      if (res.status != 200) {
        this.setState({
          server_error: true
        })
      }
      else {
        const results = res.data;
        this.setState({
          server_error: false,
          parole_single: results.parole_single || '--',
          facility_name: results.facility_name || "unknown"
        });
      }
    }).catch(res => {
      this.setState({ server_error: true });
    });
  }

  error() {
    return <div>Could not load inmate information</div>
  }

  results() {
    const paroleClasses = classNames({
      'docLabel': true,
      'error': this.oldParoledDate()
    });

    return <div>
      <li>
        <span className={paroleClasses}>Parole/release date:</span>
        <span className="docValue">{this.state.parole_single}</span>
      </li>
      <li>
        <span className="docLabel">Parent institution:</span>
        <span className="docValue">{this.state.facility_name}</span>
      </li>
        </div>
  }

  render() {
    return <ul className="inmateDOC">
      <h4>Current DOC/FBOP Records</h4>
      {this.state.server_error ? this.error() : this.results()}
    </ul>
  }
}
