import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const result = require('dotenv').config();
if (result.error) {
  console.error(result.error)
}
console.log('PARSED ENV: ', result.parsed)

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();