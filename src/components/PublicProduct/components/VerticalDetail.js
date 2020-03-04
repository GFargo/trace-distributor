import React from 'react';
import PropTypes from 'prop-types';

const VerticalDetail = ({ title, value }) => (
  !!value && (
    <div className="flex mx-4 mb-12 text-left">
      <div className="w-full">
        <h4 className="text-xl">
          <strong>{title}</strong>
        </h4>
        <h4 className="text-xl">
          {value}
        </h4>
      </div>
    </div>
  )
);

VerticalDetail.defaultProps = {
  value: '',
};

VerticalDetail.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default VerticalDetail;
