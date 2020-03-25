import React from 'react';
import PropTypes from 'prop-types';
import VerticalDetail from './VerticalDetail';
import DualVerticalDetail from './DualVerticalDetail';
import Notes from './Notes';
import BlockchainAddress from './BlockchainAddress';
import { getLotStateField } from '../utils';

const CultivationLotDetail = ({ lot, labels }) => {
  
  const details = {
    strain: {
      label: !!getLotStateField(labels, 'initial', 'strain') ? getLotStateField(labels, 'initial', 'strain')+':' : 'Strain:',
      value: getLotStateField(lot, 'initial', 'strain')
    },
    growType: {
      label: !!getLotStateField(labels, 'initial', 'growType') ? getLotStateField(labels, 'initial', 'growType')+':' : 'Grow Type:',
      value: getLotStateField(lot, 'initial', 'growType')
    },
    growMedium: {
      label: !!getLotStateField(labels, 'initial', 'growMedium') ? getLotStateField(labels, 'initial', 'growMedium')+':' : 'Grow Medium:',
      value: getLotStateField(lot, 'initial', 'growMedium')
    },
    lastMaturityDate: {
      label: !!getLotStateField(labels, 'harvest', 'lastMaturityDate') ? getLotStateField(labels, 'harvest', 'lastMaturityDate')+':' : 'Harvest Date:',
      value: getLotStateField(lot, 'harvest', 'lastMaturityDate')
    },
    cloned: {
      label: !!getLotStateField(labels, 'initial', 'cloned') ? getLotStateField(labels, 'initial', 'cloned')+':' : 'Seed Source:',
      value: getLotStateField(lot, 'initial', 'cloned')
    },
    notes: {
      label: !!getLotStateField(labels, 'grow', 'notes') ? getLotStateField(labels, 'grow', 'notes')+':' : 'Farming Practice Notes:',
      value: getLotStateField(lot, 'grow', 'notes')
    },
    nutrientCycle: {
      label: !!getLotStateField(labels, 'grow', 'nutrientCycle') ? getLotStateField(labels, 'grow', 'nutrientCycle')+':' : 'Nutrient Cycle Notes:',
      value: getLotStateField(lot, 'grow', 'nutrientCycle')
    },
  }

  return !!lot && (
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
              {(!!labels?.organization?.name) ? labels.organization.name+':': 'Cultivator Name:'}
            </h3>
            <div className="text-xl">
              {lot.organization.name}
            </div>
          </div>
        </div>
      )}
      <BlockchainAddress address={lot.address} label={(!!labels?.address) ? labels.address : 'Blockchain Address'} />
      <DualVerticalDetail
        title={[details.strain.label, details.growType.label]}
        value={[details.strain.value, details.growType.value]}
      />
      <DualVerticalDetail
        title={[details.growMedium.label, details.lastMaturityDate.label]}
        value={[details.growMedium.value, details.lastMaturityDate.value]}
      />
      <VerticalDetail
        title={details.cloned.label}
        value={details.cloned.value}
      />
      <Notes
        title={details.notes.label}
        text={details.notes.value}
      />
      <Notes
        title={details.nutrientCycle.label}
        text={details.nutrientCycle.value}
      />
    </div>
  );
}

CultivationLotDetail.defaultProps = {
  lot: {
    name: '',
    address: '',
    organization: {
      name: '',
    },
  },
  labels: {},
};

CultivationLotDetail.propTypes = {
  lot: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  labels: PropTypes.shape({}),
};

export default CultivationLotDetail;
