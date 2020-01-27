import React from 'react';
import PropTypes from 'prop-types';

const LotDetailSummary = (props) => {
  return(<div className="row LotDetailSummary">
    <div className="col-6">
      <span className="lot-org-relationship">organization owner</span>
      <h4 className="lot-org-name">{props.organization.name}</h4>
      <div className="lot-org-summary">
        <div className="summary-count">
          <h3>78</h3>
          <h5>Users</h5>
        </div>
        <div className="summary-count">
          <h3>34</h3>
          <h5>lots</h5>
        </div>
        <div className="summary-count">
          <h3>235</h3>
          <h5>sublots</h5>
        </div>
      </div>
      <div className="lot-org-verification"><i className="fa fa-check" aria-hidden="true"></i> Verified by John Doe on 01.25.2019</div>
    </div>
    <div className="col-6">
      <span className="lot-org-relationship">permitted organization</span>
      <h4 className="lot-org-name">TODO {props.organization.name}</h4>
      <div className="lot-org-summary">
        <div className="summary-count">
          <h3>78</h3>
          <h5>Users</h5>
        </div>
        <div className="summary-count">
          <h3>34</h3>
          <h5>Lots</h5>
        </div>
        <div className="summary-count">
          <h3>235</h3>
          <h5>sublots</h5>
        </div>
      </div>
      <div className="lot-org-verification"><i className="fa fa-check" aria-hidden="true"></i> Verified by John Doe on 01.25.2019</div>
    </div>
    </div>);
}

LotDetailSummary.propTypes = {
  organization: PropTypes.object
}

export default LotDetailSummary;
