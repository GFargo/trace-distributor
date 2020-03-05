import React from 'react';
import PropTypes from 'prop-types';
import ProductHeader from './components/ProductHeader';
import ProductCertifications from './components/ProductCertifications';
import ProductCompany from './components/ProductCompany';
import LotDetailSwitch from './components/LotDetailSwitch';
import ProductFooter from './components/ProductFooter';

const Product = ({ product }) => (
  <div className="container w-full max-w-xl">
    <div className="grid-row m-0 p-0">
      <div className="grid-col-12">
        <ProductHeader product={product} />
        <ProductCertifications certifications={product.certifications} />
        <ProductCompany company={product.company} />
        <LotDetailSwitch lots={product.lots} />
        <ProductFooter />
      </div>
    </div>
  </div>
);

Product.defaultProps = {
  product: {
    title: '',
    description: '',
    image: [{
      url: '',
    },],
    company: {
      name: '',
      description: '',
      url: '',
      logo: {
        url: '',
      },
      location: {
        state: '',
      },
    },
    packagingDate: '',
    certifications: [],
    lots: [],
  },
};

Product.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
    company: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string,
      logo: PropTypes.shape({
        url: PropTypes.string,
      }),
      location: PropTypes.shape({
        state: PropTypes.string,
      }),
    }),
    packagingDate: PropTypes.string,
    certifications: PropTypes.arrayOf(PropTypes.string),
    lots: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string,
      organization: PropTypes.shape({
        name: PropTypes.string,
      }),
      details: PropTypes.arrayOf(PropTypes.shape({})),
      parentLot: PropTypes.shape({
        name: PropTypes.string,
        address: PropTypes.string,
        organization: PropTypes.shape({
          name: PropTypes.string,
        }),
        details: PropTypes.arrayOf(PropTypes.shape({})),
      }),
    })),
  }),
};

export default Product;
