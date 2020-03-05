import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import graySvgPattern from '../../../core/src/images/svg/backgrounds/logo-pattern-gray.svg';

const TraceHeaderPattern = styled.div`
  width: 100%;
  background-size: 142%;
  background-image: url('${graySvgPattern}');
  background-repeat: repeat;
  background-position: bottom;
`;

const ProductHeader = ({
  product: {
    title,
    description,
    packagingDate,
    image
  },
}) => (
  <header>
    {!!title && (
      <TraceHeaderPattern className="bg grid-col-12">
        <div className="py-16">
          {!!image?.url && (
            <img
              src={image.url}
              alt="product"
              className="w-7/12 rounded-full mx-auto"
            />
          )}
        </div>
        <h1 className="text-4xl font-bold text-center">
          {title}
        </h1>
      </TraceHeaderPattern>
    )}
    {!!description && (
      <div className="grid-row mx-4 mb-2 mt-8">
        <p className="text-lg text-left">{description}</p>
      </div>
    )}
    {!!packagingDate && (
      <div className="flex flex-row items-center mx-4 mt-4 mb-8 text-lg text-left">
        <span className="icon icon-calendar text-gold-500 text-2xl mr-2 -mb-1"></span>
        <strong>Packaging Date:&nbsp;</strong>
        {packagingDate}
      </div>
    )}
    <div className="grid-row mt-6 mb-8 mx-2">
      <hr/>
    </div>
  </header>
);

ProductHeader.defaultProps = {
  product: {
    title: '',
    description: '',
    packagingDate: '',
    image: {
      url: '',
    },
  },
};

ProductHeader.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    packagingDate: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
  }),
};

export default ProductHeader;
