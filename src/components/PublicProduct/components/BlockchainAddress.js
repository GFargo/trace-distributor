import React from 'react';
import PropTypes from 'prop-types';

const BlockchainAddress = ({ address }) => (
  !!address && (
    <div className="flex mx-4 p-8 mb-12 text-left bg-gray-100">
      <div className="w-full">
        <span className="flex flex-row text-xl font-bold text-gold-500">
          <span className="icon icon-blockchain mr-2 text-2xl -mb-1"></span>
          <h4 className="mb-2">
            Blockchain Address
          </h4>
        </span>
        <div className="text-xl text-gold-500 underline">
          {`${address.substr(0,32)}...`}
        </div>
      </div>
    </div>
  )
);

BlockchainAddress.defaultProps = {
  address: '',
};

BlockchainAddress.propTypes = {
  address: PropTypes.string,
};

export default BlockchainAddress;
