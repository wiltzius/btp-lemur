import React from "react";

export default class BannerMessage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      banner_message: 'loading...'
    }
  }

  componentDidMount() {
    $.get('/lemur/api/settings/?setting=banner', (results) => {
      this.setState({
        banner_message: results
      });
    }, "json");
  }

  render() {
    return <div id="restricted">{this.state.banner_message}&nbsp;</div>
  }
}
