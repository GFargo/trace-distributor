import React, { Component } from 'react';

class NotFound extends Component {
  render() {
    return (
      <div className="container">
        <h2>Oops...</h2>
        <p>The page you requested could not be found or you do not have permissions to access it. Sorry!</p>
      </div>
    );
  }
}

export default NotFound;
