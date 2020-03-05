import React from 'react';
import TraceLogo from '../../../core/src/components/Elements/Logo';

const ProductFooter = () => (
  <div className="grid-row-12 bg-gray-900 mt-12 py-8">
    <div className="grid-col">
      <div className="grid-row text-xl text-center text-gray-100 pb-8">
        All data recorded and tracked by:
      </div>
      <div className="grid-row w-full">
        <TraceLogo className="justify-center" width="260px" svgFill="white" color="text-gray-100" />
      </div>
    </div>
  </div>
);

export default ProductFooter;
