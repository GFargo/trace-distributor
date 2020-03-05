import React from 'react';
import PropTypes from 'prop-types';
import ProductProfileForm from '../components/ProductProfileForm';

//const { PRODUCT_PROFILE_PUBLIC_WEB } = process.env;

const CreateProductProfilePage = ({ 
  populateFromID, 
  lots, 
  handleSubmitProfile,
}) => (
  <div className="container mb-24 w-160 text-left">
    <div className="mb-4">
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
        href={`https://trace.directory/lot/sample`}
        rel="noopener noreferrer"
      >
        Example Product Profile
      </a>
    </div>

    <ProductProfileForm 
      populateFromID={populateFromID}
      lots={lots}
      handleSubmit={handleSubmitProfile}
    />
  </div>
)

CreateProductProfilePage.defaultProps = {
  populateFromID: '',
}

CreateProductProfilePage.propTypes = {
  populateFromID: PropTypes.string,
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSubmitProfile: PropTypes.func.isRequired,
}

export default CreateProductProfilePage;