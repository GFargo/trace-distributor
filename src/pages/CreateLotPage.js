import React from 'react';
import PropTypes from 'prop-types';
import LotForm from '../components/LotForm';

/* TODO clarify language to use beloe */

const CreateLotPage = ({ 
  populateFromID, 
  lots, 
  handleSubmitLot,
}) => (
  <div className="mb-24 w-160 text-left">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-left mb-4">
        Create Lot
      </h3>
      <p className="text-sm text-left mb-2 pr-10">
        Something something supply chain lot.
      </p>
    </div>

    <LotForm 
      populateFromID={populateFromID}
      lots={lots}
      handleSubmit={handleSubmitLot}
    />
  </div>
)

CreateLotPage.defaultProps = {
  populateFromID: '',
}

CreateLotPage.propTypes = {
  populateFromID: PropTypes.string,
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSubmitLot: PropTypes.func.isRequired,
}

export default CreateLotPage;
