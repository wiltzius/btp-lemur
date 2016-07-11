import React from 'react';
import {Link} from 'react-router';

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
      <li>
        {/*
          <a href="{% url 'inmate-search' %}" className="{% block current_inmates %}notcurrent{% endblock %}">search
            inmates</a>
          <a className="current">search inmates</a>
         */}

        <Link to="/app/inmate/search" activeClass="current">search inmates</Link>
      </li>
      <li>
        <Link to="/app/inmate/add">add inmate</Link>
      </li>
      <li>
        <Link to="/app/order/select">select existing order</Link>
      </li>
      <li>
        <Link to="/app/order/build">build order</Link>
      </li>
      <li>
        <Link to="/app/order/send">send out order</Link>
      </li>
    </ul>
  }

}
