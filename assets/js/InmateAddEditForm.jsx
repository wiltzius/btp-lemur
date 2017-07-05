  import React from 'react';
  import classNames from 'classnames';

  export default class InmateSearchProxy extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        model: {
          first_name: '',
          last_name: '',
          address: '',
          inmate_id: '',
          facility: null,
        }
      };
      this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
      // $.get('/lemur/inmate_search_proxy/' + this.props.inmatePk, (results) => {
      //   this.setState({
      //     parole_single: results.parole_single || '--',
      //     parent_institution: results.parent_institution || "unknown"
      //   });
      // }, "json");
    }

    handleInputChange(event) {
      const newModel = {...this.state.model, [event.target.name]: event.target.value};
      this.setState({
        model: newModel
      });
      console.log(this.state);
    }

    render() {
      return <form>
        <div id="searchBoxLeft">
          <div className="fieldWrapper">
            <label>
              First name: <input type="text"
                                 name="first_name"
                                 value={this.state.model.first_name}
                                 onChange={this.handleInputChange}/>
            </label>
            <p className="note">Do not use - or ' characters</p>
          </div>
          <div className="fieldWrapper">
            <label>
              Last name: <input type="text"
                                name="last_name"
                                value={this.state.model.last_name}
                                onChange={this.handleInputChange}/>
            </label>
          </div>
        </div>
        <div id="searchBoxRight">
          <div className="fieldWrapper">
            <label>
              Inmate ID: <input type="text"
                                name="inmate_id"
                                value={this.state.model.inmate_id}
                                onChange={this.handleInputChange}/>
            </label>
          </div>
          <div className="fieldWrapper">
            <label>
              Facility:
              <select type="text"
                      name="facility"
                      value={this.state.model.facility}
                      onChange={this.handleInputChange}>

              </select>
            </label>
          </div>
          <div className="fieldWrapper" id="addressWrapper">
            <label>
              Address: <input type="text"
                              name="address"
                              value={this.state.model.address}
                              onChange={this.handleInputChange}/>
            </label>
          </div>
        </div>
        <div className="formfooter">
          <input type="submit" value="Add New Record" />
        </div>
      </form>
    }
  }
