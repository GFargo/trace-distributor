import React from 'react';
import PropTypes from 'prop-types';
import InputWrapper from '../../../core/src/components/MultiForm/parts/InputWrapper';

const PackagingDatePicker = ({ packagingDate, onChangePackagingDate }) => (
  <InputWrapper name="packagingDate" label="Product Packaging Date">
    <div className={"w-64 ml-3 mb-2"} >
      <input
        type="date"
        className="py-3 cursor-pointer rounded border border-gray-200 hover:border-gray-500 text-gray-700 font-light hover:text-gray-900"
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