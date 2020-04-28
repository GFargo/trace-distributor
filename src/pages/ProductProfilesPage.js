import React from 'react';
import PropTypes from 'prop-types';

import ProductProfilesTable from '../components/ProductProfilesTable';
import { ModalBase, PageLoader } from '../core/src/components/Elements';

const ProductProfiles = ({ productsCollection, exportPending }) => (
  <div className="">
    <div className="row mb-2 -mt-4">
      <h3 className="text-xl font-bold text-left">
        Product Profiles
      </h3>
    </div>

    <ModalBase
      ariaLabel="Product Export Pending"
      isOpen={exportPending}
      setOpen={() => {}}
      hideClose
    >
      <div className="p-12">
        <PageLoader />
        <span className="uppercase text-traceblack">Saving Product...</span>
      </div>
    </ModalBase>

    <ProductProfilesTable
      productsCollection={productsCollection}
    />
  </div>
)

ProductProfiles.propTypes = {
  productsCollection: PropTypes.array.isRequired,
  exportPending: PropTypes.bool,
}

ProductProfiles.defaultProps = {
  exportPending: false,
};

export default ProductProfiles;
