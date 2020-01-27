import React from 'react'
import PropTypes from 'prop-types'
import LotsTable from '../../trace-core/Tables/LotsTable'
import '../../trace-core/LotsIndex/LotsIndex.css'

const LotsIndex  = ({ lots, dispatch }) => (
  <div>
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <LotsTable data={lots || []} />
        </div>
      </div>
    </div>
  </div>
)

LotsIndex.propTypes = {
  lots: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default LotsIndex