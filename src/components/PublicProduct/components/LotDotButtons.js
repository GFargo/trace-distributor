import React from 'react';
import PropTypes from 'prop-types';

const LotDotButtons = ({ lots, lotSelected, onLotSelect }) => (
  <div className="flex justify-center mt-8">
    {lots.map(address => (
      (lotSelected === address) ? (
        <div key={address} className="mr-1 h-12">
          <div className="icon icon-circle mr-2 text-gold-500 text-xl"></div>
        </div>
      ) : (
        <div key={address} className="h-12">
          <button
            type="button"
            className=""
            onClick={() => onLotSelect(address)}
          >
            <div className="icon icon-circle-o mr-2 text-gold-500 text-xl"></div>
          </button>
        </div>
      )
    ))}
  </div>
);

LotDotButtons.propTypes = {
  lots: PropTypes.arrayOf(PropTypes.string).isRequired,
  lotSelected: PropTypes.string.isRequired,
  onLotSelect: PropTypes.func.isRequired,
};

export default LotDotButtons;
