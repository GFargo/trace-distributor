import React from 'react';
import ReactDOM from 'react-dom';

/** 
 * IE Polyfills
 * @see https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill
 */
// import 'react-app-polyfill/ie9'; // For IE 9-11 support
// import 'react-app-polyfill/ie11'; // For IE 11 support


import App from './App';
import registerServiceWorker from './registerServiceWorker';

require('dotenv').config();

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();