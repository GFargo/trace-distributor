import React from 'react';
import PropTypes from 'prop-types';
import InputWrapper from '../../../core/src/components/MultiForm/parts/InputWrapper';

const CERTIFICATIONS = ['ORGANIC', 'KOSHER', 'NONGMO', 'AOSCA', 'GF'];
const certFileSwitch = (cert) => {
  switch (cert) {
    case 'ORGANIC':
      return '/img/organic.png';
    case 'KOSHER':
      return '/img/kosher.png';
    case 'NONGMO':
      return '/img/nongmo.jpg';
    case 'AOSCA':
      return '/img/aosca.png';
    default:
    case 'GF':
      return '/img/gf.png';
  }
}
const CertificationCheckboxes = ({ certifications, onToggleCertification }) => (
  <InputWrapper name="productCertifications" label="Product Certifications">
    <div className={"flex flex-row pl-3"} >
      {CERTIFICATIONS.map(cert =>
        <div key={cert} className="flex flex-row pr-8 items-center">
          <input
            type="checkbox"
            className="w-auto mr-2"
            id={`certifications_${cert}`}
            checked={!!certifications[cert]}
            onChange={() => onToggleCertification(cert)}
          />
          <label
            className=""
            htmlFor={`certifications_${cert}`}
          >
            <img
              className=""
              width="72"
              src={certFileSwitch(cert)}
              alt={cert}
            />
          </label>
        </div>
      )}
    </div>
  </InputWrapper>
);

CertificationCheckboxes.defaultProps = {
  certifications: {},
};

CertificationCheckboxes.propTypes = {
  certifications: PropTypes.shape({}),
  onToggleCertification: PropTypes.func.isRequired,
};

export default CertificationCheckboxes;
