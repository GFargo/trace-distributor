import React from 'react'
import PropTypes from "prop-types"

const Footer = ({ invertColors = false }) => {
  const fontColors = invertColors ? 'text-gray-100' : 'text-gray-900';
  return (
    <div className={`flex flex-initial py-6 font-light ${fontColors}`}>
      <div className="w-1/2">
        Need Help?
        <a className={`ml-2 font-bold underline ${fontColors} hover:text-gold-500`} 
          href="https://tracevt.com/contact" target="_blank" rel="noopener noreferrer"
        >
          Contact Us
        </a>
      </div>
      <div className={`w-1/2 text-right ${fontColors}`}>
        Trace VT. 2020. All Rights Reserved.
      </div>
    </div>
  )
}

Footer.propTypes = {
  invertColors: PropTypes.bool,
}


export default Footer