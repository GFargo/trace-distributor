import React from 'react'
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { withRouter } from "react-router"
import Logo from '../../core/src/components/Elements/Logo'
import Button from '../../core/src/components/Elements/Button'

const Header = ({ username, displayLogos, containerClass = 'border-b-2', location }) => (
  <div className="" id="Header">
    <div className={`flex flex-row justify-between items-center ${containerClass}`}>
      {!!displayLogos && (
        <div className="header-logo">
          <Link className="flex flex-row items-center" to="/">
            <div className={`inline-block 'mr-3 pr-6 z'`}>
              <Logo 
                color='black'
                svgFill='black'
                width="240px"
                className="inline-block"
              />
            </div>
          </Link>
        </div>
      )}

      {!!username && (
        <div className="w-3/12">
          <p>
            Hello, <Link className="text-gold-800" to="/distributor/settings/"><strong>{username}</strong></Link>
          </p>
        </div>
      )}

      {!!username && location.pathname === "/distributor/product-profiles/" && (
        <div className="ml-auto">
          <ul className="flex flex items-center font-body">
            <Button 
              type="link"
              color="green"
              className="mb-2"
              to="/distributor/product-profile-form/"
            >
              Create Product Profile
            </Button>
          </ul>
        </div>
      )}

    </div>
  </div>
)

Header.propTypes = {
  username: PropTypes.string, //TODO define shape
  displayLogos: PropTypes.bool,
  containerClass: PropTypes.string,
  location: PropTypes.object.isRequired,
}

export default withRouter(Header)
