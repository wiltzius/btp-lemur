import React from 'react';

export default class Navbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {

  }

  render() {
    // TODO use whatever react's version of ui-routeris for these
    return <ul id="navlist">
      <li id="active">
        {/*
          <a href="{% url 'inmate-search' %}" className="{% block current_inmates %}notcurrent{% endblock %}">search
            inmates</a>
         */}
        <a className="current">search inmates</a>
      </li>
      <li>
        <a className="notcurrent">add inmate</a>
      </li>
      <li>
        <a>select existing order</a>
      </li>
      <li>
        <a>build order</a>
      </li>
      <li>
        <a>send out order</a>
      </li>
    </ul>
  }

}
