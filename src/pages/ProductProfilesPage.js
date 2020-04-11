import React from 'react';
import PropTypes from 'prop-types';
import ProductProfilesTable from '../components/ProductProfilesTable';


const ProductProfiles = ({ productsCollection }) => (
  <div className="">
    <div className="row mb-2 -mt-4">
      <h3 className="text-xl font-bold text-left">
        Product Profiles
      </h3>
    </div>
    <ProductProfilesTable productsCollection={productsCollection} />
  </div>
)

ProductProfiles.propTypes = {
  productsCollection: PropTypes.array.isRequired,
}

export default ProductProfiles;