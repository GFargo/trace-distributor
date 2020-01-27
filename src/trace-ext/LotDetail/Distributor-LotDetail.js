import React from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import LotDetailHeader from '../../trace-core/LotDetail/Components/LotDetailHeader'
import LotDetailSummary from '../../trace-core/LotDetail/Components/LotDetailSummary'
import LotStateSection from '../../trace-core/LotDetail/Components/LotStateSection'
import SublotSection from '../../trace-core/LotDetail/Components/SublotSection'
import Pending from '../../trace-core/Components/Pending'
import '../../trace-core/LotDetail/LotDetail.css'

import FileUpload from '../../trace-ext/FileUpload/FileUpload'

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

const LotDetail = ({ lot, dispatch }) => !lot ? <Pending /> : 
<>
  <LotDetailHeader
    name={lot.name}
    address={lot.address}
    organization={lot.organization}
    type={lot.hasParent ? "Processing" : "Cultivating"}
  />

  {!!lot.organization && <LotDetailSummary organization={lot?.organization} />}
  
  {lot.hasParent && <Link to={`/cultivating/${lot.parentLot.address}`} className="btn parent-link">
    View Parent Lot Data
  </Link>}
  
  <LotStateSection lot={fixStateImages(lot)}/>

  {!!lot.subLots?.length && <SublotSection sublots={lot.subLots} />}

  {lot.state === 'extracting' && ((!!lot.extractPDF?.name) ? 
  <h5> {'Extraction Results: '+lot.extractPDF.name} </h5> :
  <FileUpload types='application/pdf, .pdf' title='Upload Extraction Results' placeholder='Choose a PDF file' 
    onUploadFile={(file) => dispatch({ type: 'uploadPDF', file, result: lot.state })} 
  />)}

  {lot.state === 'testing' && ((!!lot.testPDF?.name) ? 
  <h5> {'Test Results: '+lot.testPDF.name} </h5> :
  <FileUpload types='application/pdf, .pdf' title='Upload Test Results' placeholder='Choose a PDF file'
    onUploadFile={(file) => dispatch({ type: 'uploadPDF', file, result: lot.state })} 
  />)}
</>

LotDetail.propTypes = {
  lot: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}

export default LotDetail