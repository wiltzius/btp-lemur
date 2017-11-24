import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import configure from './lib/csrf-jquery-hack';
// import App from "./App";
import {SemanticTest} from './Semantic';

configure();
console.log('hello');

// ReactDOM.render((
//   <BrowserRouter basename="/lemur">
//     <App/>
//   </BrowserRouter>
// ), document.getElementById('reactApp'));


ReactDOM.render(<SemanticTest />, document.getElementById('reactApp'));
