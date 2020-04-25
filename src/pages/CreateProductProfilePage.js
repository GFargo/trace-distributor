import React from 'react';
import PropTypes from 'prop-types';
import ProductProfileForm from '../components/ProductProfileForm';

const TRACE_DIRECTORY_URL = process.env.REACT_APP_TRACE_DIRECTORY || 'https://develop.trace.directory/lot/';

const CreateProductProfilePage = ({ 
  populateFromProduct, 
  lots, 
  handleSubmitProfile,
}) => (
  <div className="mb-24 w-full text-left">
    <div className="mb-4 w-2/3 lg:w-1/2">
      <h3 className="text-xl font-bold text-left mb-4">
        Create Product Profile
      </h3>
      <p className="text-sm text-left mb-2 pr-10">
        Build trust with your consumers by giving them information regarding the cultivation,
        processing and manufacturing process of your product.
      </p>
      <a
        className="text-gold-700"
        target="_blank"
        href={`${TRACE_DIRECTORY_URL}sample`}
        rel="noopener noreferrer"
      >
        Example Product Profile
      </a>
    </div>

    <ProductProfileForm 
      populateFromProduct={populateFromProduct}
      lots={lots}
      handleSubmit={handleSubmitProfile}
    />
  </div>
)

CreateProductProfilePage.propTypes = {
  populateFromProduct: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.bool,
  ]).isRequired,
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSubmitProfile: PropTypes.func.isRequired,
}

export default CreateProductProfilePage;
