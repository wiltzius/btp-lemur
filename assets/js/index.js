//require('./InmateSearchProxy');

import ReactDOM from 'react-dom';
import InmateSearchProxy from './InmateSearchProxy.jsx';

// bootstrap the React app by attaching InmateSearchProxy instance to their placeholders in the html template

console.log('whatever');

var containers = document.querySelectorAll('.inmateSearchProxyContainer');
for(var i=0; i < containers.length; i++) {
  var el = containers[i];
  var inmate_pk = el.attributes["data-inmate-id"].value;
  ReactDOM.render(<InmateSearchProxy inmatePk={inmate_pk}/>, el);
}
