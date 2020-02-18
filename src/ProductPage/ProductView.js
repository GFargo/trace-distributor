import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import graySvgPattern from '../core/src/images/svg/backgrounds/logo-pattern-gray.svg'
import TraceLogo from '../core/src/components/Elements/Logo'

const getLotStateData = (lot, state) => {
  const data = lot.details.find((one) => one.state === state).data
  return data
}

const PrimaryTitle = ({ text }) => (
  <div className="row m-6">
    <p className="col h1 text-center">{text}</p>
  </div>
)

const SecondaryTitle = ({ text }) => (
  <div className="row m-6">
    <p className="col h3 text-center">{text}</p>
  </div>
)

const Description = ({ text }) => (
  <div className="row mx-12 mb-2">
    <p className="h3">{text}</p>
  </div>
)

const DescriptionFootnote = ({ title, text }) => (
  <div className="row mx-12 mb-12">
    <p className="h3"><strong>{title+':'}&nbsp;</strong>{text}</p>
  </div>
)

const LogoImage = ({ url }) => (
  <div className="row mt-6">
    <img src={url} alt="logo" className="w-25 mx-auto d-block rounded-circle img-fluid"/>
  </div>
)

const VerticalDetail = ({ title, value }) => (
  <div className="mx-12 mb-12">
    <div className="text-center">
      <div className="">
        <p className="h3"><strong>{title}</strong></p>
      </div>
      <div className="">
        <p className="h3">{value || ''}</p>
      </div>
    </div>
  </div>
)

const DualVerticalDetail = ({ title, value }) => (
  <div className="row mx-12 mb-12">
    <div className="col-6 text-center">
      <div className="">
        <p className="h3"><strong>{title[0]}</strong></p>
      </div>
      <div className="">
        <p className="h3">{value[0] || ''}</p>
      </div>
    </div>
    <div className="col-6 text-center">
      <div className="">
        <p className="h3"><strong>{title[1]}</strong></p>
      </div>
      <div className="">
        <p className="h3">{value[1] || ''}</p>
      </div>
    </div>
  </div>
)

const Notes = ({ title, text }) => (
  <div className="row mx-12 mb-12">
    <div className="col-12">
      <div className="">
        <p className="h3"><strong>{title}</strong></p>
      </div>
      <div className="">
        <p className="h3">{text || ''}</p>
      </div>
    </div>
  </div>
)

const SupplyDescription = ({ count }) => (
  <div className="mx-12 mb-2">
    <p className="h3 text-center">{'This product was compiled from the following '+count+' lots:'}</p>
  </div>
)

const CultivationLotDetail = ({ lot }) => (
  <div className="mb-2">
    <PrimaryTitle text={lot.name} />
    <VerticalDetail title={'Cultivator Name:'} value={lot.organization.name} />
    <VerticalDetail title={'Blockchain Address:'} value={lot.address} />
    <VerticalDetail title={'Harvest Date:'} value={getLotStateData(lot, 'harvest').lastMaturityDate} />
    <DualVerticalDetail 
      title={['Genetics:', 'Grow Type:']} 
      value={[getLotStateData(lot, 'initial').strain, getLotStateData(lot, 'initial').growType]} 
    />
    <DualVerticalDetail 
      title={['Grow Medium:', 'Seed or Clone:']} 
      value={[getLotStateData(lot, 'initial').growMedium, (getLotStateData(lot, 'initial').cloned) ? 'clone' : 'seed']} 
    />
    <Notes title={'Farming Practice Notes:'} text={getLotStateData(lot, 'grow').notes} />
    <Notes title={'Nutrient Cycle Notes:'} text={getLotStateData(lot, 'grow').nutrientCycle} />
  </div>
)

const ProcessingLotDetail = ({ lot }) => (
  <div className="mb-2">
    <PrimaryTitle text={lot.name} />
    <VerticalDetail title={'Extractor Name:'} value={lot.organization.name} />
    <VerticalDetail title={'Blockchain Address:'} value={lot.address} />
    <DualVerticalDetail 
      title={['Extraction Type:', 'Extraction Date:']} 
      value={[getLotStateData(lot, 'extracted').extractionType, getLotStateData(lot, 'extracted').extractionDate]} 
    />
  </div>
)

const Dots = ({ lots, lotSelected, setLotSelected }) => (
  <div className="mt-6 text-center">
    {lots.map((lot, index) => (lotSelected === index) ? 
      <i key={index} className="fas fa-circle fa-3x btn pr-2"></i> :
      <i key={index} className="far fa-circle fa-3x btn pr-2" onClick={() => setLotSelected(index)}></i>
    )}
  </div>
)

const TestingResults = ({ dnaReportLinks }) => (
  <div  className="row">
    <div className="col-xs-12 mx-auto btn" onClick={() => {/*pdfLink.url*/}}>
      {dnaReportLinks.map((pdfLink, index) => 
        <div key={index} className="row">
          <i className="fa fa-file-pdf fa-3x p-3"></i>
          <p className="h3 pt-4">{pdfLink.name}</p>
        </div>
      )}
    </div>
  </div>
)

const TraceHeaderPattern = styled.div`
  width: 100%;
  background-size: 142%;
  background-image: url('${graySvgPattern}');
  background-repeat: repeat;
  background-position: bottom;
`

const TraceProductImage = ({ imageUrl }) => (
  <TraceHeaderPattern className="bg col-xs-12">
    <div className="row pt-24 pb-32">
      <img src={imageUrl} alt="product" className="w-75 mx-auto d-block rounded-circle img-fluid"/>
    </div>
  </TraceHeaderPattern>
)

const PrimaryProductTitle = ({ text }) => (
  <div className="row m-6">
    <p className="col h1 text-center">{text}</p>
  </div>
)

const TraceProductFooter = () => (

    <div className="row bg-light mt-12">
      <div className="w-5/12 pl-4 py-2 text-justiy-left">
        <SecondaryTitle className="text-justiy-left" text='All data recorded and tracked by:' />
      </div>
      <div className="w-6/12 pl-4 pt-8 p">
        <TraceLogo className="" width="360px" svgFill="black" color="black" />
      </div>
    </div>
)

export const ProductView = ({ productLots }) => {
  const [ lotSelected, setLotSelected ] = useState(0)
  const lot = productLots[lotSelected]
  //console.log('productLots: ', productLots)
  const product = getLotStateData(productLots[0], 'complete').product
  //console.log('product: ', product)

  return (
    <div className="container-fluid max-w-5xl">
      <div className="row pl-3">
        <div className="col-xs-12"> 
          <TraceProductImage imageUrl={product.image?.url || ''} />
          <PrimaryProductTitle text={product.title} />
          <Description text={product.description} />
          <DescriptionFootnote 
            title={'Packaging Date'} 
            text={product.created} 
          />
          <div className="row bg-light">
            <div className="col">
              <LogoImage url={product.company?.logo?.url || ''} />
              <PrimaryTitle text={product.company?.name || ''} />
              <Description text={product.company?.description || ''} />
              <DescriptionFootnote 
                title={'Distributor Location'} 
                text={(product.company?.location?.state || '')+', '+(product.company?.location?.country || '')} 
              />
            </div>
          </div>
          <PrimaryTitle text={'Lot Information'} />
          {!!productLots.length && <SupplyDescription count={productLots.length} />}
          <Dots 
            lots={productLots} 
            lotSelected={lotSelected} 
            setLotSelected={setLotSelected} 
          />
          {!lot.parentLot && <CultivationLotDetail lot={lot} />}
          {!!lot.parentLot && <CultivationLotDetail lot={lot.parentLot} />}
          {!!lot.parentLot && <ProcessingLotDetail lot={lot} />}
          {!!product.dnaReportUrl?.length && <SecondaryTitle text={'Testing Documentation For This Lot'} />}
          {!!product.dnaReportUrl?.length && <TestingResults dnaReportLinks={product.dnaReportUrl} />}
          <TraceProductFooter /> 
        </div>
      </div>
    </div>
  )
}

ProductView.propTypes = {
  productLots: PropTypes.array.isRequired
}

export default ProductView