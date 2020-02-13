import React from 'react'
import PropTypes from 'prop-types'
import Pending from '../core/src/components/Elements/Loader'
import Lot from '../core/src/components/Lots/Lot'

const translateImagesToAnchors = (images) => (
  (!!images?.length) ? images.map((each) => 
    !!each?.image && <a key={each.image.hash} href={each.image.url} target="_blank" rel="noopener noreferrer">
      {each.caption || 'image'}
    </a>) : null
)
/*
const translateImagesToUrl = (images) => (
  (!!images?.length) ? images.map((each) => !!each?.image && each.image.url) : null
)
*/
const fixStateImages = (lot) => (!!lot?.stateDetails?.data) ? ({
  ...lot,
  stateDetails: {
    ...lot.stateDetails,
    data: {
      ...lot.stateDetails.data,
      images: (!!lot?.stateDetails?.data?.images) ? translateImagesToAnchors(lot.stateDetails.data.images) : undefined,
      productImage: (!!lot?.stateDetails?.data?.productImage) ? translateImagesToAnchors([lot.stateDetails.data.productImage]) : undefined
    }
  },
  details: lot.details.map((state) => (!!state?.data?.images || !!state?.data?.productImage) ? ({
    ...state,
    data: {
      ...state.data,
      images: (!!state?.data?.images) ? translateImagesToAnchors(state.data.images) : undefined,
      productImage: (!!state?.data?.productImage) ? translateImagesToAnchors([state.data.productImage]) : undefined
    }
  }) : state)
}) : lot

const LotDetail = ({ lot }) => (!lot) ? <Pending /> : <Lot data={fixStateImages(lot)} />

LotDetail.propTypes = {
  lot: PropTypes.object.isRequired
}

export default LotDetail