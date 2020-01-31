import React from 'react'
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

import Logo from '../../core/src/components/Elements/Logo'

// TODO: Refactor, this should not receieve username.  Should retrieve via some global reducer hook or something.
const Header = ({ username = '', displayLogos, containerClass = 'border-b-2' }) => (
  <div className="" id="Header">
    <div className={`flex flex-row justify-between items-center ${containerClass}`}>
      {displayLogos && (
        <div className="header-logo">
          <Link className="flex flex-row items-center" to="/">
            <div className={`inline-block 'mr-3 pr-6 z'`}>
              <Logo 
                color='black'
                svgFill='black'
                width="175px"
                className="inline-block"
              />
            </div>
          </Link>
        </div>
      )}
    </div>
  </div>
)

Header.propTypes = {
  username: PropTypes.string,
  invertColors: PropTypes.bool,
  displayLogos: PropTypes.bool,
  containerClass: PropTypes.string,
}

export default Header
