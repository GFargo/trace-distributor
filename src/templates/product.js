import React from 'react';
import PropTypes from 'prop-types';
import Pending from '../core/src/components/Elements/Loader'
import PublicProduct from '../components/PublicProduct';
import { useLatestLotProduct } from '../services/traceFirebase';

const ProductPage = ({ address }) => {
  const [product, loading, error] = useLatestLotProduct(address); 
  //console.log('ProductPage, product: ', product);

  const ErrorView = () => (
    <h3>{`Error Loading Product Lot ${address}: ${error || ''}`}</h3>
  );

  return (
    (!product && loading) ? <Pending /> : 
    (!product || !!error) ? <ErrorView /> : 
    <PublicProduct product={product} />
  );
};

ProductPage.propTypes = {
  address: PropTypes.string.isRequired,
};

export default ProductPage;
