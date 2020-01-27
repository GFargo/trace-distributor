import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

export const LotDetailHeaderDetails = ({ type, organization, name }) => {
  return(
    <div className="col">
      <div className="backButton">
        <Link to={`/${type}`}><i className="fa fa-chevron-left" aria-hidden="true"></i></Link>
      </div>
      <h1>{name}<img src="/img/verified.svg" alt=""/></h1>
      {organization && <h4 data-testid={organization.domain}><small>{organization.domain}</small></h4>}
    </div>
  );
}
LotDetailHeaderDetails.propTypes = {
  type: PropTypes.string,
  organization: PropTypes.object,
  name: PropTypes.string,
}
export const LotDetailHeaderAddress = ({address}) => {
  return(
    <div className="col">
      <h3><i className="fab fa-codepen"></i> Address</h3>
      <h4>
        <small>{address}</small>
      </h4>
    </div>
  );
}
LotDetailHeaderAddress.propTypes = {
  address: PropTypes.string,
}

export const LotDetailHeaderType = ({type}) => {
  return(
    <div className="col">
      <button type="button" className="btn btn-custom" disabled>
        <i className="fas fa-flask"></i>{type}
      </button>
    </div>
  );
}
LotDetailHeaderType.propTypes = {
  type: PropTypes.string,
}

const LotDetailHeader = ({name, organization, address, type}) => {
  return(
    <div className="row align-items-end LotDetailHeader">
      <LotDetailHeaderDetails type={type} organization={organization} name={name}/>
      <LotDetailHeaderAddress address={address} />
      <LotDetailHeaderType type={type} />
    </div>
  );
}

LotDetailHeader.propTypes = {
  type: PropTypes.string,
  organization: PropTypes.object,
  name: PropTypes.string,
  address: PropTypes.string
}

export default LotDetailHeader;
