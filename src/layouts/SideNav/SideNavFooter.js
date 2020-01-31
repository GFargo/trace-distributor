import React from 'react';
import { Link } from "react-router-dom";

import { Copy } from '@core/components/Elements';

// TODO: Swap out hardcoded text with value from config.

const SideNavHeader = () => (
  <div className="p-5 text-white font-light">
    <Copy>
      <p className="mb-2">Need Help? <Link className="text-gold-500 font-normal hover:underline" to="/p/contact/">Contact Us</Link></p>
      <p>Trace VT 2020</p>
    </Copy>
  </div>
);

export default SideNavHeader;
