import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TableFilterInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  render(){
    return(
      <div  className='tableSortInput float-right'>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => {this.props.onApply(this.state.value)}}
        >Search</button>

        <span className='table-search-wrapper'>
          <input
            onChange={(e) => {this.setState({value: e.target.value})}}
            type='text'
            placeholder={this.props.placeholder}
          />
          <i className="fa fa-search search-icon" onClick={() => {this.props.onApply(this.state.value)}} aria-hidden="true"></i>
        </span>
      </div>
    );
  }
}

TableFilterInput.propTypes = {
  placeholder: PropTypes.string,
  onApply: PropTypes.func
}

export default TableFilterInput;
