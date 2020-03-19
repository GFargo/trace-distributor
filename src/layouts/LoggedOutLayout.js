import React from 'react'
import PropTypes from 'prop-types'

import { Layout as CoreLayout } from '../core/src/layouts';
import { TracePattern } from '../core/src/components/Elements'

const LoggedOutLayout = ({ hasBackground, children }) => {
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
      headerPadding="py-4 md:py-8"
      headerLogoWidth="215px"
      layoutId="layout_root"
      footerPadding="py-4 md:py-8"
      footerNav={footerNav}
    >
      {children}
    </CoreLayout>
  );
}

LoggedOutLayout.propTypes = {
  children: PropTypes.object,
  hasBackground: PropTypes.bool,
}

LoggedOutLayout.defaultProps = {
  hasBackground: true,
}

export default LoggedOutLayout