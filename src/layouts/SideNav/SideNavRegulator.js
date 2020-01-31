import React from 'react';
import { Link } from "react-router-dom";

import LogoutLink from '@core/components/LogoutLink'
import Accordion from '@core/components/Elements/Accordion';

import SideNavLink from './SideNavLink'

const SideNavGrower = () => (
  <ul className="sidenav-nav text-white font-body font-light">
    <SideNavLink to="/" targetSlug="" icon="dashboard" title="Dashboard" exact/>

    <Accordion
      headerClassName="w-full p-4 border-l-4 border-transparent font-light hover:text-gold-300"
      activeHeaderClass="border-gold-500"
      contentClassName="pb-3 pl-10 pr-4"
      header={
        <span className="flex flex-row leading-relaxed">
          <i className="mr-3 text-xl flex items-center icon-agencies" />
          Agencies
        </span>
      }
    >
      <ul className="list-none font-light text-sm">
        <li className="py-3"><Link to="/p/dept-ag">Department of Agriculture</Link></li>
        <li className="py-3"><Link to="/p/dept-labor">Department of Labor</Link></li>
        <li className="py-3"><Link to="/p/dept-health">Department of Health</Link></li>
        <li className="py-3"><Link to="/p/dept-public-safety">Department of Public Safety</Link></li>
      </ul>
    </Accordion>

    <SideNavLink to="/organizations/" targetSlug="organizations" icon="organizations" title="Organizations" />
    <SideNavLink to="/cultivating/" targetSlug="cultivating" icon="cultivation" title="Cultivation" />
    <SideNavLink to="/processing/" targetSlug="processing" icon="processing" title="Processing" />
    <SideNavLink to="/permits/" targetSlug="permits" icon="permits" title="Permits" />
    <SideNavLink to="/settings/" targetSlug="settings" icon="settings" title="Settings" />

    <div className="py-4 px-5">
    <LogoutLink className="flex flex-row items-center hover:text-gold-500" />
    </div>
  </ul>
);

export default SideNavGrower;
