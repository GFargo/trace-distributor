import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SortableTableHeader extends Component {
  constructor(props) {
    super(props);

    this.isActive = this.isActive.bind(this);
    this.iconClass = this.iconClass.bind(this);
    this.renderStyle = this.renderStyle.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

 isActive() {
   return(this.props.name === this.props.by);
 }

 iconClass() {
   return(this.props.order === 'desc' ? "fa fa-sort-alpha-up" : "fa fa-sort-alpha-down" );
 }

 renderStyle() {
   return (!this.isActive() ? { cursor: 'pointer', color: '#666'} : {cursor: 'pointer'});
 }

 handleClick() {
   let newState = { sortBy: this.props.name }

   if (this.isActive()) {
     newState.sortOrder = this.props.order === 'desc' ? 'asc' : 'desc'
   }

   this.props.onSort(newState)
 }

 render() {
   return(
      <th style={this.renderStyle()} onClick={this.handleClick}>
        {this.props.displayName} {this.isActive() && <i className={this.iconClass()}></i>}
      </th>
    )
  }
}

SortableTableHeader.propTypes = {
  name: PropTypes.string,
  by: PropTypes.string,
  order: PropTypes.string,
  onSort: PropTypes.func,
  displayName: PropTypes.string
}
