import React from 'react'
import PropTypes from 'prop-types'
import Footer from './Footer/Footer'
import Header from './Header/Header'

import { TracePattern } from '../core/src/components/Elements/Backgrounds/TracePattern'

const LoginLayout = ({ invertColors = false, className, children }) => (
  <TracePattern className="bg-gray-100" bgPosition="right -35%">
    <div className="ml-0">
      <div className="container ml-12 mr-auto">
        <div className="flex flex-col min-h-screen">
          <Header containerClass="pt-6" displayLogos={true} />
          <div className="flex-auto flex items-center">
            {children}
          </div>
          <Footer invertColors={false} />
        </div>
      </div>
    </div>
  </TracePattern>
)

LoginLayout.propTypes = {
  className: PropTypes.string,
  invertColors: PropTypes.bool,
  children: PropTypes.object,
}

export default LoginLayout