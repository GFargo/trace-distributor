import React from 'react';
import { Link } from "react-router-dom";

import Logo from '../../core/src/components/Elements/Logo';

const SideNavHeader = () => (
  <div className="sidenav-header bg-redblack mb-6">
    <Link className="nav-link" to="/">
      <Logo width="185px" color="white" className="p-6" />
    </Link>
  </div>
);

export default SideNavHeader;