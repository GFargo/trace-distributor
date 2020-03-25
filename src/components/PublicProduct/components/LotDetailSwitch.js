import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CultivationLotDetail from './CultivationLotDetail';
import ProcessingLotDetail from './ProcessingLotDetail';
import LotDotButtons from './LotDotButtons';

const LotDetailSwitch = ({ lots, labels }) => {
  const lotAddresses = Object.keys(lots);
  const [ lotSelected, setLotSelected ] = useState(lotAddresses[0]);
  const lot = (!!lotAddresses?.length) ? lots[lotSelected] : null;
  const parentLot = (!!lot?.parentLot) ? lot.parentLot : null;

  return (
    !!lotAddresses?.length && (
      <div className="mt-6">
        <div className="grid-row mt-6 mb-4">
          <h2 className="text-4xl text-center">
            Lot Information
          </h2>
        </div>
        {lotAddresses.length > 1 && (
          <p className="text-lg mx-8 mb-2 text-center font-bold">
            {`This product was compiled from the following ${lotAddresses.length} cultivation lots:`}
          </p>
        )}
        {lotAddresses.length === 1 && (
          <p className="text-lg mx-8 mb-2 text-center font-bold">
            {`This product was compiled from the following cultivation lot:`}
          </p>
        )}
        <div className="grid-row mt-8 mb-4 mx-2">
          <hr/>
        </div>
        {lotAddresses.length > 1 && (
          <LotDotButtons lots={lotAddresses} lotSelected={lotSelected} onLotSelect={setLotSelected} />
        )}
        {!!lot && !parentLot && <CultivationLotDetail lot={lot} labels={labels[lotSelected] || {}} />}
        {!!parentLot && <CultivationLotDetail lot={parentLot} labels={labels[lotSelected]?.parentLot || {}} />}
        {!!parentLot && <ProcessingLotDetail lot={lot} labels={labels[lotSelected] || {}} />}
        {lotAddresses.length > 1 && (
          <LotDotButtons lots={lotAddresses} lotSelected={lotSelected} onLotSelect={setLotSelected} />
        )}
      </div>
    )
  );
}

LotDetailSwitch.defaultProps = {
  lots: {},
  labels: {},
};

LotDetailSwitch.propTypes = {
  lots: PropTypes.shape({}),
  labels: PropTypes.shape({}),
};

export default LotDetailSwitch;
