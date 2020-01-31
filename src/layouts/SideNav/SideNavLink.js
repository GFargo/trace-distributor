import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";

const SideNavLink = ({ to, icon, title, ...props }) => {
  return (
    <li className="flex flex-row">
      <NavLink 
        className="w-full border-l-4 border-transparent hover:text-gold-300 active:border-l-4 active:border-gold-700 focus:border-gold-500 hover:border-gold-500" 
        activeClassName="bg-darkbrown border-gold-600 text-gold-500"
        to={to}
        {...props}
      >
        <div className="p-4 flex flex-row items-center leading-relaxed">
          <i className={`mr-3 text-xl icon-${icon} flex items-center`} />
          {title}
        </div>
      </NavLink>
    </li>
  );
}

SideNavLink.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string
}

export default SideNavLink;
