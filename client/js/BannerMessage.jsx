import React from "react";
import _ from 'lodash';

export default class BannerMessage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      banner_message: ''
    }
  }

  componentDidMount() {
    console.log('asdf');
    fetch('/api/settings_store/').then(results => results.json()).then(j => {
      console.log('result is', j);

      //const settings = flow()(j);
      //const settings = compose()(j);
      const settings = _(j).keyBy('settingName').mapValues('settingValue').value();
      this.setState({
        banner_message: settings.banner_message
      });
    });
  }

  render() {
    return <div id="restricted">{this.state.banner_message}&nbsp;</div>
  }
}
