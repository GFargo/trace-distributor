import React from 'react';
import PropTypes from 'prop-types';
import VerticalDetail from './VerticalDetail';

const DualVerticalDetail = ({ title, value }) => (
  (!!value[0] && !!value[1]) ? (
    <div className="flex mx-4 mb-8 text-left">
      <div className="w-7/12">
        <h4 className="text-xl">
          <strong>{title[0]}</strong>
        </h4>
        <h4 className="text-xl">
          {value[0]}
        </h4>
      </div>
      <div className="w-5/12 pl-4">
        <h4 className="text-xl">
          <strong>{title[1]}</strong>
        </h4>
        <h4 className="text-xl">
          {value[1]}
        </h4>
      </div>
    </div>
  ) : (value[0]) ? (
    <VerticalDetail
      title={title[0]}
      value={value[0]}
    />
  ) : (value[1]) ? (
    <VerticalDetail
      title={title[1]}
      value={value[1]}
    />
  ) : false
);

DualVerticalDetail.defaultProps = {
  value: ['',''],
};

DualVerticalDetail.propTypes = {
  title: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};

export default DualVerticalDetail;
