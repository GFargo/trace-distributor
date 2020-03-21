import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CultivationLotDetail from './CultivationLotDetail';
import ProcessingLotDetail from './ProcessingLotDetail';
import LotDotButtons from './LotDotButtons';

const LotDetailSwitch = ({ lots }) => {
  const [ lotSelected, setLotSelected ] = useState(0);
  const lot = (lots?.length) ? lots[lotSelected] : null;
  const parentLot = (lot?.parentLot) ? lot.parentLot : null;

  return (
    !!lots?.length && (
      <div className="mt-6">
        <div className="grid-row mt-6 mb-4">
          <h2 className="text-4xl text-center">
            Lot Information
          </h2>
        </div>
        {lots.length > 1 && (
          <p className="text-lg mx-8 mb-2 text-center font-bold">
            {`This product was compiled from the following ${lots.length} cultivation lots:`}
          </p>
        )}
        {lots.length === 1 && (
          <p className="text-lg mx-8 mb-2 text-center font-bold">
            {`This product was compiled from the following cultivation lot:`}
          </p>
        )}
        <div className="grid-row mt-8 mb-4 mx-2">
          <hr/>
        </div>
        {lots.length > 1 && (
          <LotDotButtons lots={lots} lotSelected={lotSelected} onLotSelect={setLotSelected} />
        )}
        {!!lot && !parentLot && <CultivationLotDetail lot={lot} />}
        {!!parentLot && <CultivationLotDetail lot={parentLot} />}
        {!!parentLot && <ProcessingLotDetail lot={lot} />}
        {lots.length > 1 && (
          <LotDotButtons lots={lots} lotSelected={lotSelected} onLotSelect={setLotSelected} />
        )}
      </div>
    )
  );
}

LotDetailSwitch.defaultProps = {
  lots: [],
};

LotDetailSwitch.propTypes = {
  lots: PropTypes.arrayOf(PropTypes.shape({})),
};

export default LotDetailSwitch;
