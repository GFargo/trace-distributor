import React from 'react';

import LogoutLink from '@core/components/LogoutLink'
import SideNavLink from './SideNavLink'

// import DataService from '@core/services/DataService'
// const ds = new DataService();

const SideNavGrower = () => (
  <ul className="sidenav-nav text-white font-body font-light list-none">
    <SideNavLink to="/permits/" targetSlug="" icon="permits" title="My Permits" />
    <SideNavLink to="/payments/" targetSlug="payments" icon="payments" title="Payments" />
    <SideNavLink to="/settings/" targetSlug="settings" icon="settings" title="Settings" />
    
    <li>
      <LogoutLink className="py-5 px-6 flex flex-row items-center hover:text-gold-400" />
    </li>
  </ul>
);

export default SideNavGrower;
