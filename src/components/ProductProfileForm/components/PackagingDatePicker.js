import React from 'react';
import PropTypes from 'prop-types';
import InputWrapper from '../../../core/src/components/MultiForm/parts/InputWrapper';

const PackagingDatePicker = ({ packagingDate, onChangePackagingDate }) => (
  <InputWrapper name="packagingDate" label="Product Packaging Date">
    <div className={"w-64 ml-3 mb-2"} >
      <input
        type="date"
        className="py-3 cursor-pointer rounded border border-gray-500 hover:border-gray-800 text-gray-700 hover:text-gray-900 opacity-50"
        id="packagingDate"
        value={packagingDate}
        onChange={(event) => onChangePackagingDate(event.target.value)}
      />
    </div>
  </InputWrapper>
);

PackagingDatePicker.propTypes = {
  packagingDate: PropTypes.string.isRequired,
  onChangePackagingDate: PropTypes.func.isRequired,
};

export default PackagingDatePicker;