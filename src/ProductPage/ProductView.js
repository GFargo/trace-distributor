import React from 'react'

const traceProductToLots = (product) => {
  const lots = []
  let parent = (!!product?.supplyLot) ? product.supplyLot : null
  while (!!parent) {
    lots.unshift(parent)
    parent = parent.parentLot
  }
  return lots
}

const getLotStateData = (lot, state) => {
  const data = lot.details.find((one) => one.state === state).data
  return data
}

const ProductImage = ({ url }) => (
  <div className="img-container w-100">
    <img src={url} alt="product" className="img-fluid" />
  </div>
)

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

const Dot = () => (
  <div className="mt-12">
    <p className="h3 text-center">DOT</p>
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

const TestingResults = ({ lot }) => (
  <div className="mx-12 mb-2 mt-6">
    <p className="h5 text-center">{'PDF...'}</p>
  </div>
)

const CultivationLotDetail = ({ lot }) => (
  <div className="mb-2">
    <Dot />
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
    <Dot />
    <PrimaryTitle text={lot.name} />
    <VerticalDetail title={'Extractor Name:'} value={lot.organization.name} />
    <VerticalDetail title={'Blockchain Address:'} value={lot.address} />
    <DualVerticalDetail 
      title={['Extraction Type:', 'Extraction Date:']} 
      value={[getLotStateData(lot, 'extracted').extractionType, getLotStateData(lot, 'extracted').extractionDate]} 
    />
    <SecondaryTitle text={'Testing Documentation For This Lot'} />
    <TestingResults lot={lot} />
  </div>
)

const SupplyLotDetails = ({ supplyLots }) => (
  supplyLots.map((lot, index) => (!lot.parentLot) ? 
    <CultivationLotDetail key={index} lot={lot} /> :
    <ProcessingLotDetail key={index} lot={lot} />
  )
)

const Footer = () => (
  <footer className="footer full-height">
    <div className="row m-12">
      <p className="col h1 text-center">{'TRACE FOOTER IMAGE'}</p>
    </div>
  </footer>
)


export const ProductView = ({ product }) => {

  const supplyLots = traceProductToLots(product)
  console.log('supplyLots: '+supplyLots)

  return (
    <div className="container-fluid max-w-5xl">
      <div className="row pl-3">
        <div className="col-xs-12"> 
          <ProductImage url={product.image.url} />
          <PrimaryTitle text={product.title} />
          <Description text={product.description} />
          <DescriptionFootnote 
            title={'Packaging Date'} 
            text={product.created} 
          />
          <div className="row bg-light">
            <div className="col">
              <LogoImage url={product.company.logo.url} />
              <PrimaryTitle text={product.company.name} />
              <Description text={product.company.description} />
              <DescriptionFootnote 
                title={'Distributor Location'} 
                text={product.company.location.state+', '+product.company.location.country} 
              />
            </div>
          </div>
          <PrimaryTitle text={'Lot Information'} />
          {!!supplyLots.length && 
            <SupplyDescription count={supplyLots.length} /> 
          }
          {!!supplyLots.length && 
            <SupplyLotDetails supplyLots={supplyLots} /> 
          }
          <Footer /> 
        </div>
      </div>
    </div>
  )
}

export default ProductView