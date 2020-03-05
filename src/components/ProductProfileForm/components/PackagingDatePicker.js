import React from 'react';
import PropTypes from 'prop-types';
import InputWrapper from '../../../core/src/components/MultiForm/parts/InputWrapper';

const PackagingDatePicker = ({ packagingDate, onChangePackagingDate }) => (
  <InputWrapper name="packagingDate" label="Product Packaging Date">
    <div className={"row row-sm w-25 pl-3"} >
      <input
        type="date"
        className=""
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