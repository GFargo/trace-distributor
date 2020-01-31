import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer/Footer';
import Header from './Header/Header';

const LoginLayout = ({ children, invertColors = false, className }) => (
  <div className={`ml-0 ${className}`}>
    <div className="container mx-auto">
      <div className="flex flex-col min-h-screen">
        <Header containerClass="pt-6" displayLogos={true} />
        <div className="flex-auto flex items-center">
          {children}
        </div>
        <Footer invertColors={invertColors} />
      </div>
    </div>
  </div>
)

LoginLayout.propTypes = {
  children: PropTypes.object,
  className: PropTypes.string,
  invertColors: PropTypes.bool,
}

export default LoginLayout;