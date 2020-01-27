import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon'

import './LotSummaryCard.css'

const DESCRIPTIONS = {
  "unassigned": "Lots that have just been created but are yet fully submitted.",
  "new": "Lots that have just been submitted but are not yet fully initiated.",
  "initial": "Lots that have been initiated but have yet to begun growing.",
  "grow": "Lots that are currently being grown.",
  "harvest": "Lots that have harvested but not yet tested or extracted.",
  "extracting": "Lots that are currently being extracted.",
  "extracted": "Lots that have been extracted.",
  "testing": "Lots that are currently being tested.",
  "tested": "Lots that have finished a testing phase.",
  "product": "Lots that have converted into sellable products.",
  "completed": "Lots that have finished the Trace lifecycle.",
};

const LotSummaryCard = ({ active, count, stateName, testId }) => {
  let cn = 'lot-summary-card';
  cn = cn + (active ? ' active' : '')

  return(
    <div data-testid={testId} className={cn}>
       <h3>{count} Lots</h3>
       <h4><Icon icon="beaker"></Icon> {stateName.charAt(0).toUpperCase() + stateName.slice(1)}</h4>
       <p><em>{DESCRIPTIONS[stateName]}</em></p>
    </div>
  );
}

LotSummaryCard.propTypes = {
  active: PropTypes.bool,
  count: PropTypes.number,
  stateName: PropTypes.string,
  testId: PropTypes.string
}

export default LotSummaryCard;
