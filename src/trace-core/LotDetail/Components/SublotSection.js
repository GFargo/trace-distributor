import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './SublotSection.css';

const formatSublotCreated = (dateString) => {
  let d = new Date(dateString);
  let month = `${d.getMonth() + 1}`.padStart(2,0);
  let day = `${d.getDay()}`.padStart(2,0);
  return `Created at ${d.getHours()}:${d.getMinutes()} on ${day}-${month}-${d.getFullYear()}`
}

class SublotRow extends Component {
  render() {
    let lot = this.props.sublot;
    let details = lot.details;

    if (typeof details ===  'undefined') {
      details = {state: 'undefined'}
    }

    return(
      <li className="SubLotRow row">
        <div className="col-2">
          <h4><Link onClick={this.props.onClick} to={`/processing/${lot.address}`}>{lot.name}</Link></h4>
          <p>Weight: <span className="bold">{lot.totalSupply}g</span></p>
        </div>
        <div className="col">
          <p>{formatSublotCreated(lot.created)}</p>
          <p>Sublot state: <span className='capitalize bold'>{lot.state}</span></p>
        </div>
      </li>
    )
  }
}

SublotRow.propTypes = {
  sublot: PropTypes.object,
  onClick: PropTypes.func
}

class SublotSection extends Component {
  render() {
    return(
      <div className="SubLotSection">
        <div className="summary-row">
          <h2>Sublots</h2>
          <p>This lot has been split into sublots. Information about each sublot may be found on it&#39;s own page.</p>
        </div>
        
        <ul className="sublots">
        {this.props.sublots.map((sublot) => {
            return(
              <SublotRow key={sublot.address}  sublot={sublot} />
            )
          })
         }
        </ul>
      </div>
    )
  }
}

SublotSection.propTypes = {
  sublots: PropTypes.array
}

export default SublotSection
