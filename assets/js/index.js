import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import configure from './lib/csrf-jquery-hack';
import App from "./App";

configure();
console.log('hello');

ReactDOM.render((
  <BrowserRouter basename="/lemur">
    <App/>
  </BrowserRouter>
), document.getElementById('reactApp'));
