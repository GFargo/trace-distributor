import React from 'react'
import PropTypes from 'prop-types'
import Footer from './Footer/Footer'
import Header from './Header/Header'

const LandingLayout = ({ invertColors = false, className, children }) => (
  <div className="bg-gray-100">
    <div className="container ml-12 mr-auto">
      <div className="flex flex-col min-h-screen min-w-screen">
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