import React, { Component } from 'react';

import './Pending.css';


class Pending extends Component {
  render() {
    return (
      <div className="container pending">
        <img src="/img/loading.gif" alt='loading' title='loading'/>
      </div>
    );
  }
}

export default Pending;
