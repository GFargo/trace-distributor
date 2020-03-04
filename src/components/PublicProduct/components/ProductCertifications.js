import React from 'react';
import PropTypes from 'prop-types';

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

const ProductCertifications = ({ certifications }) => (
  !!certifications?.length && (
    <div className="grid-row mx-4 mb-12 text-left">
      <div className="grid-col">
        <h3 className="text-xl font-bold mb-6">
          Product Certifications
        </h3>
        <div className={"flex flex-row pl-3"} >
          {certifications.map(cert =>
            <div key={cert} className="flex flex-row pr-8 items-center">
              <img
                className=""
                width="72"
                src={certFileSwitch(cert)}
                alt={cert}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
);

ProductCertifications.defaultProps = {
  certifications: [],
};

ProductCertifications.propTypes = {
  certifications: PropTypes.arrayOf(PropTypes.string),
};

export default ProductCertifications;
