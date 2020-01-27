import React from 'react';
import PropTypes from 'prop-types';

import {formatDateString} from '../LotSectionHelpers';

import InitialStateSection from './LotStateSections/InitialStateSection'
import GrowStateSection    from './LotStateSections/GrowStateSection'
import HarvestStateSection from './LotStateSections/HarvestStateSection'
import ExtractStateSection from './LotStateSections/ExtractStateSection'
import TestStateSection    from './LotStateSections/TestStateSection'
import GenericLotSection   from './LotStateSections/GenericLotSection'

const stateSwitch = function(lotState) {
  switch(lotState.state) {
  case "initial":
    return(<InitialStateSection key={lotState.state+lotState.created} { ...lotState } />)
  case "grow":
    return(<GrowStateSection key={lotState.state+lotState.created} { ...lotState } />)
  case "extracted":
    return(<ExtractStateSection key={lotState.state+lotState.created} { ...lotState } />)
  case "harvest":
    return(<HarvestStateSection key={lotState.state+lotState.created} { ...lotState } />)
  case "tested":
    return(<TestStateSection key={lotState.state+lotState.created} { ...lotState } />)
  default:
    return(<GenericLotSection key={lotState.state+lotState.created} { ...lotState } />)
  }
}

const LotStateSection = (props) => {
  return(
    <div className="row LotStateSection">
        <nav>
          <div className="state-buttons">
            {
              props.lot.details.map((lotState) => {
                let className = lotState === props.lot.details[props.lot.details.length - 1] ? "btn active" : "btn";
                return(
                  <button key={`${lotState.infoFileHash}-button`} className={className}>{lotState.state}</button>
                )
              })
            }
          </div>
        </nav>
        <ul className="state-row">
        {
          props.lot.details.map((lotState) => {
            return(
              <li key={`${lotState.infoFileHash}-li`} id={lotState.state}>
                <h5>{lotState.state}</h5>
                <h6>{formatDateString(lotState.created)}</h6>
                <p className="lot-org-relationship">Organization Owner</p>
                <p><strong>{props.lot.organization.name}</strong>, {props.lot.organization.owner.firstName}</p>
                <hr />
                {stateSwitch(lotState)}
              </li>
            );
          })
        }
        </ul>
    </div>
  );
}

LotStateSection.propTypes = {
  lot: PropTypes.object
}
export default LotStateSection;
