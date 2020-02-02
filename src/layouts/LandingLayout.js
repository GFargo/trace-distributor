import React from 'react'
import PropTypes from 'prop-types'

import Footer from './Footer/Footer'
import Header from './Header/Header'

const LandingLayout = ({ invertColors = false, className, children }) => (
  <div className="">
    <div className="container-fluid">
      <div className="flex flex-col min-h-screen min-w-screen px-12">
        <Header containerClass="pt-6" displayLogos={true} />
        <div className="flex-auto flex items-center">
          {children}
        </div>
        <Footer invertColors={false} />
      </div>
    </div>
  </div>
)

LandingLayout.propTypes = {
  className: PropTypes.string,
  invertColors: PropTypes.bool,
  children: PropTypes.object,
}

export default LandingLayout