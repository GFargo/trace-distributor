import React from 'react'
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

import Logo from '../../core/src/components/Elements/Logo'
import NavLink from './Components/NavLink'

/* TODO Make Bill of Goods link a btn */
const Header = ({ username, displayLogos, containerClass = 'border-b-2' }) => (
  <div className="" id="Header">
    <div className={`flex flex-row justify-between items-center ${containerClass}`}>
      {!!displayLogos && (
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

      {!!username && (
        <>
          <div className="w-3/12">
            <p>
              Hello, <Link className="text-gold-800" to="/distributor/settings/"><strong>{username}</strong></Link>
            </p>
          </div>

          <div className="ml-auto">
            <ul className="flex flex items-center font-body">
              <NavLink
                className='text-gray-800'
                to="/distributor/manifest-creator/"
                label="Create Bill Of Goods"
              />
            </ul>
          </div>
        </>
      )}

    </div>
  </div>
)

Header.propTypes = {
  username: PropTypes.string, //TODO define shape
  displayLogos: PropTypes.bool,
  containerClass: PropTypes.string,
}

export default Header
