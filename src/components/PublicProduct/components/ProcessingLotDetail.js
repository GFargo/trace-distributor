import React from 'react';
import PropTypes from 'prop-types';
import DualVerticalDetail from './DualVerticalDetail';
import { getLotStateField } from '../utils';

const ProcessingLotDetail = ({ lot }) => (
  !!lot && (
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
            Extractor Name
          </h3>
          <div className="text-xl text-left">
            {lot.organization.name}
          </div>
        </div>
      )}
      <DualVerticalDetail
        title={['Extraction Type:', 'Extraction Date:']}
        value={[
          getLotStateField(lot, 'extracted', 'extractionType'),
          getLotStateField(lot, 'extracted', 'extractionDate'),
        ]}
      />
    </div>
  )
);

ProcessingLotDetail.defaultProps = {
  lot: {
    name: '',
    address: '',
    organization: {
      name: '',
    },
  },
};

ProcessingLotDetail.propTypes = {
  lot: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

export default ProcessingLotDetail;
