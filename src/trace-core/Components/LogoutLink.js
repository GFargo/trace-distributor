import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon'
import DataService from '../services/DataService'

let ds = new DataService();

class LogoutLink extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    ds.destroySession();
  }

  render() {
    return (
      <a onClick={this.handleClick} className={this.props.className} href="/">
        {!this.props.noIcon && <Icon icon="logout" />}
        Logout
      </a>
    );
  }
}

LogoutLink.propTypes = {
  className: PropTypes.string,
  noIcon: PropTypes.bool
};

export default LogoutLink;
