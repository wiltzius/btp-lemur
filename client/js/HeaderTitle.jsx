import React from 'react';

export default class HeaderTitle extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: 'Books to Prisoners'
    }
  }
 
  componentDidMount() {
    // TODO read current page title from URL router map
  }
 
  render() {
    return <h1>{this.state.title}</h1>
  }
  
}
