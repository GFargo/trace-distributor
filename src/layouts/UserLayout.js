import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

import { Layout as CoreLayout, SidebarLink } from '../core/src/layouts';
import { TracePattern, Button } from '../core/src/components/Elements'

const UserLayout = ({ 
  hasBackground, 
  onLogout, 
  username, 
  showCreateLotButton,
  showCreateProductButton,
  children 
}) => {
  const footerNav = () => (
    <div>
      Need Help?
      <a className={`ml-2 font-bold underline hover:text-gold-500`}
        href="https://tracevt.com/contact" target="_blank" rel="noopener noreferrer"
      >
        Contact Us
      </a>
    </div>
  )

  if (hasBackground) {
    return (
      <TracePattern className="bg-gray-100" bgPosition="right -35%">
        <CoreLayout
          headerPadding="py-4 md:py-8"
          headerLogoWidth="215px"
          layoutId="layout_root"
          footerPadding="py-4 md:py-8"
          footerNav={footerNav}
        >
          {children}
        </CoreLayout>
      </TracePattern>
    );
  }

  return (
    <CoreLayout
      type="sidebar"
      headerDisplayLogo={false}
      headerIsFluid
      headerNavContainerClass="w-full"
      headerNav={(
        <React.Fragment>
          {!!username && (
            <div className="mr-64">
              <p className="">
                Hello, <Link className="text-gold-800" to="/distributor/settings/"><strong>{username}</strong></Link>
              </p>
            </div>
          )}

          {!!username && showCreateLotButton && (
            <div className="ml-32">
              <ul className="flex flex items-center font-body">
                <Button 
                  type="link"
                  color="green"
                  className=""
                  to="/distributor/lot-form/"
                >
                  Create New Lot
                </Button>
              </ul>
            </div>
          )}

          {!!username && showCreateProductButton && (
            <div className="ml-32">
              <ul className="flex flex items-center font-body">
                <Button 
                  type="link"
                  color="green"
                  className=""
                  to="/distributor/product-profile-form/"
                >
                  Create Product Profile
                </Button>
              </ul>
            </div>
          )}
        </React.Fragment>
      )}
      sidebarContent={(
        <ul className="sidenav-nav text-white font-body font-light list-none">
          <SidebarLink to="/distributor/lots" icon="processing" title="Lots" />
          <SidebarLink to="/distributor/product-profiles/" icon="organizations" title="Product Profiles" />
          <SidebarLink to="/distributor/settings/" icon="settings" title="Settings" />
          <li>
            <a onClick={onLogout} className="py-5 px-6 flex flex-row items-center hover:text-gold-400" href="/">
              <i className="mr-3 icon-logout" />
              Logout
            </a>
          </li>
        </ul>
      )}
      headerContainerPadding="border-b border-gray-300"
      layoutId="layout_root"
      footerPadding="py-4 md:py-8"
      footerNav={footerNav}
    >
      {children}
    </CoreLayout>
  );
}

UserLayout.defaultProps = {
  showCreateLotButton: false,
  showCreateProductButton: false,
  hasBackground: false,
}

UserLayout.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  showCreateLotButton: PropTypes.bool,
  showCreateProductButton: PropTypes.bool,
  hasBackground: PropTypes.bool,
  children: PropTypes.object.isRequired,
}

export default UserLayout