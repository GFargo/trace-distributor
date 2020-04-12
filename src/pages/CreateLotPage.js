import React from 'react';
import PropTypes from 'prop-types';
import LotForm from '../components/LotForm';

/* TODO clarify language to use beloe */

const CreateLotPage = ({ 
  populateFromLot,
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
      populateFromLot={populateFromLot}
      handleSubmit={handleSubmitLot}
    />
  </div>
)

CreateLotPage.propTypes = {
  populateFromLot: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.bool,
  ]).isRequired,
  handleSubmitLot: PropTypes.func.isRequired,
}

export default CreateLotPage;
