import React from 'react';
import PropTypes from 'prop-types';

const ProductCompany = ({
  company: {
    name,
    description,
    location,
    logo
  },
}) => (
  <div className="grid-row bg-gray-100 text-center">
    <div className="grid-col text-center">
      {!!logo?.url && (
        <div className="grid-row pt-16 text-center">
          <img
            src={logo.url}
            alt="logo"
            className="w-5/12 rounded-full mx-auto"
          />
        </div>
      )}
      {!!name && (
        <div className="grid-row mb-6 mt-12 text-3xl font-bold text-center">
          {name}
        </div>
      )}
      {!!description && (
        <div className="grid-row mx-4 mb-4">
          <p className="text-lg text-left">{description}</p>
        </div>
      )}
      {!!location?.state && (
        <div className="flex flex-row items-center text-lg mx-4 pb-12 text-left">
          <span className="icon icon-map-marker text-gold-500 text-2xl mr-2 -mb-2"></span>
          <strong>Distributor Location:&nbsp;</strong>
          {`${location.state}, USA`}
        </div>
      )}
    </div>
  </div>
);

ProductCompany.defaultProps = {
  company: {
    name: '',
    description: '',
    location: { state: '' },
    logo: { url: '' }
  },
};

ProductCompany.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.shape({
      state: PropTypes.string,
    }),
    logo: PropTypes.shape({
      url: PropTypes.string,
    }),
  }),
};

export default ProductCompany;
