import React from 'react';
import PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import ProductProfilesTable from '../components/ProductProfilesTable';


const ProductProfiles = ({ 
  email, 
}) => (
  <div className="container">
    <div className="row mb-2 -mt-4">
      <h3 className="text-xl font-bold text-left">
        Product Profiles
      </h3>
    </div>
    <ProductProfilesTable email={email} />
  </div>
)

ProductProfiles.propTypes = {
  email: PropTypes.string.isRequired,
}

export default ProductProfiles;