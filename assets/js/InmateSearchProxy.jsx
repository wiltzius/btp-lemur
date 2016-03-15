import React from 'react';

export default class InmateSearchProxy extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      paroled_date: 'loading...',
      projected_parole: 'loading...',
      parent_institution: 'loading...'
    }
  }

  componentDidMount() {
    $.get('/lemur/inmate_search_proxy/' + this.props.inmatePk, (results) => {
      console.log(results);
      this.setState({
        paroled_date: results.paroled_date || '--',
        projected_parole: results.projected_parole || '--',
        parent_insitution: results.parent_institution || "unknown"
      });
    }, "json");
  }

  render() {
    console.log(this.props.inmatePk);
    return <ul className="inmateDOC">
      <li><span className="resultLabel">Parole/release date:</span><span className="resultvalue">{this.state.paroled_date}</span>
      </li>
      <li><span className="resultLabel">Proj. parole/release date:</span><span
          className="resultvalue">{this.state.projected_parole}</span>
      </li>
      <li><span className="resultLabel">Parent institution:</span><span className="resultvalue">{this.state.parent_institution}</span>
      </li>
    </ul>
  }
}
