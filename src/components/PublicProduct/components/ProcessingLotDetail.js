import React from 'react';
import PropTypes from 'prop-types';
import DualVerticalDetail from './DualVerticalDetail';
import BlockchainAddress from './BlockchainAddress';
import { getLotStateField } from '../utils';

const ProcessingLotDetail = ({ lot, labels }) => {

  const details = {
    extractionType: {
      label: !!getLotStateField(labels, 'extracted', 'extractionType') ? getLotStateField(labels, 'extracted', 'extractionType')+':' : 'Extraction Type:',
      value: getLotStateField(lot, 'extracted', 'extractionType')
    },
    extractionDate: {
      label: !!getLotStateField(labels, 'extracted', 'extractionDate') ? getLotStateField(labels, 'extracted', 'extractionDate')+':' : 'Extraction Date:',
      value: getLotStateField(lot, 'extracted', 'extractionDate')
    },
  }

  return !!lot && (
    <div className="my-2">
      <div className="grid-row mt-12 mb-8 mx-4">
        <hr/>
      </div>
      {!!lot?.name && (
        <div className="grid-row mx-4 mb-6 text-3xl font-bold text-left">
          {lot.name}
        </div>
      )}
      {!!lot?.organization?.name && (
        <div className="w-full text-left mx-4 mb-8">
          <h3 className="text-2xl mb-2 font-bold text-gold-500 text-left">
            {(!!labels?.organization?.name) ? labels.organization.name+':' : 'Extractor Name:'}
          </h3>
          <div className="text-xl text-left">
            {lot.organization.name}
          </div>
        </div>
      )}
      <BlockchainAddress address={lot.address} label={(!!labels?.address) ? labels.address : 'Blockchain Address'} />
      <DualVerticalDetail
        title={[details.extractionType.label, details.extractionDate.label]}
        value={[details.extractionType.value, details.extractionDate.value]}
      />
    </div>
  );
}

ProcessingLotDetail.defaultProps = {
  lot: {
    name: '',
    address: '',
    organization: {
      name: '',
    },
  },
  labels: {},
};

ProcessingLotDetail.propTypes = {
  lot: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  labels: PropTypes.shape({}),
};

export default ProcessingLotDetail;
