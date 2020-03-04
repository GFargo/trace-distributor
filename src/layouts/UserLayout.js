import React from 'react'
import PropTypes from 'prop-types'

import Header from './Header/Header'
import SideNav from './SideNav/SideNav'

const UserLayout = ({ username, onLogout, children }) => (
  <div className="flex flex-row bg-gray-100">
    <SideNav onLogout={onLogout} className="w-3/12 lg:w-2/12" />

    <div className="flex flex-col flex-grow min-h-screen w-3/12 lg:w-2/12">
      <div className="px-8 py-4">
        <Header username={username} />
      </div>

      <div className="p-8">
        {children}
      </div>
    </div>
  </div>
)

UserLayout.propTypes = {
  username: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.object
}

export default UserLayout