import React from 'react'
import PropTypes from 'prop-types'
import Pending from './PendingTrans'
import Lot from '../core/src/components/Lots/Lot'

const fixImages = (images) => (
  (!!images?.length) ? images.map((each) => 
    !!each?.image && <a key={each.image.hash} href={each.image.url} target="_blank" rel="noopener noreferrer">
      {each.caption || 'image'}
    </a>) : null
)

const fixStateImages = (lot) => (!!lot?.stateDetails?.data?.images?.length) ? ({
  ...lot,
  stateDetails: {
    ...lot.stateDetails,
    data: {
      ...lot.stateDetails.data,
      images: fixImages(lot.stateDetails.data.images)
    }
  },
  details: lot.details.map((state) => (!!state?.data?.images?.length) ? ({
    ...state,
    data: {
      ...state.data,
      images: fixImages(state.data.images)
    }
  }) : state)
}) : lot

const LotDetail = ({ lot }) => (!lot) ? <Pending /> : <Lot data={fixStateImages(lot)} />

LotDetail.propTypes = {
  lot: PropTypes.object.isRequired
}

export default LotDetail