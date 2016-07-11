import React from 'react';

export default class InmateSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  render() {
    return <div>
      <div id="inmateSearch">
        <form>
          <div id="searchBoxLeft">
            <div class="fieldWrapper">
              Inmate ID: <input type="text"/>
              <p class="note">e.g. K12345</p>
            </div>
          </div>
          <div id="searchBoxRight">
            <div class="fieldWrapper">
              First name: <input type="text"/>
            </div>
            <div class="fieldWrapper">
              Last name: <input type="text"/>
            </div>
          </div>
          <div class="formfooter">
            <input type="submit" name="submit" value="Search for Inmate"/>
          </div>
        </form>
      </div>

  
    </div>
  }

}
