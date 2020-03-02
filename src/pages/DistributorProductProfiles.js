import React from 'react';
import PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import ProductProfileForm from '../components/ProductProfileForm';
import ProductProfilesTable from '../components/ProductProfilesTable';


const ProductProfiles = ({ 
  email, 
  lots, 
  selection, 
  onToggleSelection, 
  onClearProductProfile, 
  onExportProductProfile 
}) => (
  <div className="container">
    <div className="row mb-2 -mt-4">
      <h3 className="text-xl font-bold text-left">
        Product Profiles
      </h3>
    </div>
    <ProductProfilesTable email={email} />
    <div className="mt-12 mb-4">
      <h3 className="text-xl font-bold text-left -ml-4 mb-4">
        Create Product Profile
      </h3>
      <p className="text-sm text-left mb-2 pr-10">
        Build trust with your consumers by giving them information regarding the cultivation,
        processing and manufacturing process of your product.
      </p>
      <Link 
        className=""
        target="_blank"
        to={'/product/0x22Cb9826B15148c88b4F53B13d91a1187A157f69'}
      >
        Example Product Profile
      </Link>
    </div>
    <ProductProfileForm 
      lots={lots}
      buttonLabel={'Create Product Profile'}
      handleSubmit={onExportProductProfile}
      errorMessage={''}
      isSubmitPending={false}
      invertColor={false}
    />
  </div>
)

ProductProfiles.propTypes = {
  email: PropTypes.string.isRequired,
  lots: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  onClearProductProfile: PropTypes.func.isRequired,
  onExportProductProfile: PropTypes.func.isRequired,
}

export default ProductProfiles