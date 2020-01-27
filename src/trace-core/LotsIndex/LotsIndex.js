import React from 'react';
import PropTypes from 'prop-types';
import './LotsIndex.css';
import LotsTable from '../Tables/LotsTable'
import DataService from '../services/DataService'

let ds = new DataService();

const LotsIndex  = ({type}) => {
  let lots;
  if (type === "cultivating") {
     lots = ds.getCultivating();
  } else if (type === "processing") {
    lots = ds.getProcessing()
  } else { lots = ds.getAllLots(); }

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <LotsTable data={lots} />
          </div>
        </div>
      </div>
    </div>
  );
}

LotsIndex.propTypes = {
  type: PropTypes.string
}

export default LotsIndex;
