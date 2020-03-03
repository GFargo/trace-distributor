import React from 'react';
import PropTypes from 'prop-types';
import Pending from '../core/src/components/Elements/Loader'
import PublicProduct from '../components/PublicProduct';
import { useProduct } from '../services/traceFirebase';

const ProductPage = ({ id }) => {
  const [product, loading, error] = useProduct(id); 
  //console.log('ProductPage, product: ', product);

  const ErrorView = () => (
    <h3>{`Error Loading Product Lot ${id}: ${error || ''}`}</h3>
  );

  return (
    (!product && loading) ? <Pending /> : 
    (!product || !!error) ? <ErrorView /> : 
    <PublicProduct product={product} />
  );
};

ProductPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ProductPage;
