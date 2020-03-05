import React from 'react';
import PropTypes from 'prop-types';
import VerticalDetail from './VerticalDetail';
import DualVerticalDetail from './DualVerticalDetail';
import Notes from './Notes';
import BlockchainAddress from './BlockchainAddress';
import { getLotStateField } from '../utils';

const CultivationLotDetail = ({ lot }) => (
  !!lot && (
    <div className="mb-2 mt-8">
      {!!lot?.name && (
        <div className="grid-row mx-4 mb-6 text-3xl font-bold text-left">
          {lot.name}
        </div>
      )}
      {!!lot?.organization?.name && (
        <div className="flex mx-4 mb-8 text-left">
          <div className="w-full">
            <h3 className="text-2xl mb-2 font-bold text-gold-500">
              Cultivator Name
            </h3>
            <div className="text-xl">
              {lot.organization.name}
            </div>
          </div>
        </div>
      )}
      <BlockchainAddress address={lot.address} />
      <DualVerticalDetail
        title={['Genetics:', 'Grow Type:']}
        value={[
          getLotStateField(lot, 'initial', 'strain'),
          getLotStateField(lot, 'initial', 'growType'),
        ]}
      />
      <DualVerticalDetail
        title={['Grow Medium:', 'Harvest Date:']}
        value={[
          getLotStateField(lot, 'initial', 'growMedium'),
          getLotStateField(lot, 'harvest', 'lastMaturityDate'),
        ]}
      />
      <VerticalDetail
        title="Seed Source:"
        value={getLotStateField(lot, 'initial', 'cloned') === true ? 'clone' : 
          getLotStateField(lot, 'initial', 'cloned') === false ? 'seed' : ''}
      />
      <Notes
        title="Farming Practice Notes:"
        text={getLotStateField(lot, 'grow', 'notes')}
      />
      <Notes
        title="Nutrient Cycle Notes:"
        text={getLotStateField(lot, 'grow', 'nutrientCycle')}
      />
    </div>
  )
);

CultivationLotDetail.defaultProps = {
  lot: {
    name: '',
    address: '',
    organization: {
      name: '',
    },
  },
};

CultivationLotDetail.propTypes = {
  lot: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

export default CultivationLotDetail;
