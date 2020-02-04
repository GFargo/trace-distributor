import React from 'react'
import PropTypes from 'prop-types'
import SideNavHeader from './SideNavHeader'
import SideNavLink from './SideNavLink';
import SideNavFooter from './SideNavFooter'
import Icon from '../../core/src/components/Elements/Icon'

const SideNav = ({ onLogout, className }) => {

  const handleLogout = (event) => {
    event.preventDefault()
    onLogout()
  }

  return (
    <div id="SideNav" className={`bg-traceblack ${className}`}>
      <div className="flex flex-col relative min-h-screen">
        <div className="fixed min-h-screen w-3/12 lg:w-2/12">
          <SideNavHeader />

          <ul className="sidenav-nav text-white font-body font-light list-none">
            <SideNavLink to="/distributor/products" icon="processing" title="Products" />
            <SideNavLink to="/distributor/manifest-creator/" icon="organizations" title="Bills of Goods" />
            <SideNavLink to="/distributor/settings/" icon="settings" title="Settings" />
            <li>
              <a onClick={handleLogout} className="py-5 px-6 flex flex-row items-center hover:text-gold-400" href="/">
                <Icon icon="logout" className="mr-3" />
                Logout
              </a>
            </li>
          </ul>

          <div className="absolute bottom-0 pt-32">
            <SideNavFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

SideNav.propTypes = {
  onLogout: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default SideNav