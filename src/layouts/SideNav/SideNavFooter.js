import React from 'react'
import Copy from '../../core/src/components/Elements/Copy'

const SideNavHeader = () => (
  <div className="p-5 text-white font-light">
    <Copy>
      <p className="mb-2">
        Need Help? 
        <a className="text-gold-500 font-normal hover:underline" 
          href="https://tracevt.com/contact" target="_blank" rel="noopener noreferrer" 
        >
          Contact Us
        </a>
      </p>
      <p>Trace VT 2020</p>
    </Copy>
  </div>
)

export default SideNavHeader