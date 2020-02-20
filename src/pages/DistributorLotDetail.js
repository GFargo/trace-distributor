import React from 'react'
import PropTypes from 'prop-types'
import Pending from '../core/src/components/Elements/Loader'
import Lot from '../core/src/components/Lots/Lot'

const LotDetail = ({ lot }) => (!lot) ? <Pending /> : <Lot data={lot} />

LotDetail.propTypes = {
  lot: PropTypes.object.isRequired
}

export default LotDetail