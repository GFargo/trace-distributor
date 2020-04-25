import React from 'react';
import PropTypes from 'prop-types';

import ProductHeaderPattern from '../../../core/src/components/PublicProduct/Components/Header/ProductHeaderPattern';
import ProductHeader from '../../../core/src/components/PublicProduct/Components/Header';
import ProductFooter from '../../../core/src/components/PublicProduct/Components/Footer';
import ProductCertifications from '../../../core/src/components/PublicProduct/Components/ProductCertifications';
import ProductCompany from '../../../core/src/components/PublicProduct/Components/ProductCompany';
import LotDetails from '../../../core/src/components/PublicProduct/Components/LotDetails';

const ProductPreview = ({ 
  product,
}) => (
  <>

    {!!product && (
      <>
        <div className="bg-white shadow-lg">
          <ProductHeaderPattern>
            <div className="grid-row m-0 pt-20">
              <div className="grid-col-12">
                <ProductHeader product={product} />
                {!!product.certifications && <ProductCertifications certs={product.certifications} />}
                {!!product.company && <ProductCompany company={product.company} />}
                {!!product.lots && <LotDetails lots={product.lots} labels={product.labelOverrides} />}
                <ProductFooter />
              </div>
            </div>
          </ProductHeaderPattern>
        </div>
      </>
    )}
  </>
)

ProductPreview.propTypes = {
  product: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.bool,
  ]).isRequired,
}

export default ProductPreview;
