import React from 'react';
import PropTypes from 'prop-types';

import SideNavHeader from './SideNavHeader';
import SideNavGrower from './SideNavGrower';
import SideNavRegulator from './SideNavRegulator';
import SideNavFooter from './SideNavFooter';

const SideNav = ({ type = 'grower', className }) => {
  return (
    <div id="SideNav" className={`bg-traceblack ${className}`}>
      <div className="flex flex-col relative min-h-screen">
        <div className="fixed min-h-screen w-3/12 lg:w-2/12">
        <SideNavHeader />

        {type && type === 'grower' && (
          <SideNavGrower />
        )}

        {type && type === 'regulator' && (
          <SideNavRegulator />
        )}

        <div className="absolute bottom-0 pt-32">
          <SideNavFooter />
        </div>
        </div>
      </div>
    </div>
  );
}

SideNav.propTypes = {
  type: PropTypes.oneOf(['regulator', 'grower']),
  className: PropTypes.string,
}


export default SideNav;
