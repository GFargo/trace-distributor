import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
//import { Link }  from 'react-router-dom';//from 'gatsby'; TODO Change this back
//import DownloadIcon from '../../core/src/images/svg/icons/download.svg';
import graySvgPattern from '../../core/src/images/svg/backgrounds/logo-pattern-gray.svg';
import TraceLogo from '../../core/src/components/Elements/Logo';

// TODO: Convert all styling from bootstrap to tailwind
// TODO: Update components to match new design

const getLotStateField = (lot, state, field) => {
  const cat = !!lot.details && lot.details.find(one => one.state === state);
  const value = (!cat || !cat.data || !cat.data[field]) ? null : cat.data[field]
  return value;
}

const TraceHeaderPattern = styled.div`
  width: 100%;
  background-size: 142%;
  background-image: url('${graySvgPattern}');
  background-repeat: repeat;
  background-position: bottom;
`;

const ProductHeader = ({
  product: {
    title,
    description,
    packagingDate,
    image
  },
}) => (
  <header>
    {!!title && (
      <TraceHeaderPattern className="bg grid-col-12">
        <div className="py-16">
          {!!image?.url && (
            <img
              src={image.url}
              alt="product"
              className="w-7/12 rounded-full mx-auto"
            />
          )}
        </div>
        <h1 className="text-4xl font-bold text-center">
          {title}
        </h1>
      </TraceHeaderPattern>
    )}
    {!!description && (
      <div className="grid-row mx-4 mb-2 mt-8">
        <p className="text-lg text-left">{description}</p>
      </div>
    )}
    {!!packagingDate && (
      <div className="flex flex-row items-center mx-4 mt-4 mb-8 text-lg text-left">
        <span className="icon icon-calendar text-gold-500 text-2xl mr-2 -mb-1"></span>
        <strong>Packaging Date:&nbsp;</strong>
        {packagingDate}
      </div>
    )}
    <div className="grid-row mt-6 mb-8 mx-2">
      <hr/>
    </div>
  </header>
);

ProductHeader.defaultProps = {
  product: {
    title: '',
    description: '',
    packagingDate: '',
    image: {
      url: '',
    },
  },
};

ProductHeader.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    packagingDate: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
  }),
};

const ProductCertifications = ({ certifications }) => (
  !!certifications?.length && (
    <div className="grid-row mx-4 mb-12 text-left">
      <div className="grid-col">
        <h3 className="text-xl font-bold mb-6">
          Product Certifications
        </h3>
        <div className="flex flex-row justify-around">
          {certifications.map(cert => (
            <div key={cert} className="">
              {cert}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
);

ProductCertifications.defaultProps = {
  certifications: [],
};

ProductCertifications.propTypes = {
  certifications: PropTypes.arrayOf(PropTypes.string),
};

const ProductCompany = ({
  company: {
    name,
    description,
    location,
    logo
  },
}) => (
  <div className="grid-row bg-gray-100 text-center">
    <div className="grid-col text-center">
      {!!logo?.url && (
        <div className="grid-row pt-16 text-center">
          <img
            src={logo.url}
            alt="logo"
            className="w-5/12 rounded-full mx-auto"
          />
        </div>
      )}
      {!!name && (
        <div className="grid-row mb-6 mt-12 text-3xl font-bold text-center">
          {name}
        </div>
      )}
      {!!description && (
        <div className="grid-row mx-4 mb-4">
          <p className="text-lg text-left">{description}</p>
        </div>
      )}
      {!!location?.state && (
        <div className="flex flex-row items-center text-lg mx-4 pb-12 text-left">
          <span className="icon icon-map-marker text-gold-500 text-2xl mr-2 -mb-2"></span>
          <strong>Distributor Location:&nbsp;</strong>
          {`${location.state}, USA`}
        </div>
      )}
    </div>
  </div>
);

ProductCompany.defaultProps = {
  company: {
    name: '',
    description: '',
    location: { state: '' },
    logo: { url: '' }
  },
};

ProductCompany.propTypes = {
  company: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.shape({
      state: PropTypes.string,
    }),
    logo: PropTypes.shape({
      url: PropTypes.string,
    }),
  }),
};

const VerticalDetail = ({ title, value }) => (
  !!value && (
    <div className="flex mx-4 mb-12 text-left">
      <div className="w-full">
        <h4 className="text-xl">
          <strong>{title}</strong>
        </h4>
        <h4 className="text-xl">
          {value}
        </h4>
      </div>
    </div>
  )
);

VerticalDetail.defaultProps = {
  value: '',
};

VerticalDetail.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const DualVerticalDetail = ({ title, value }) => (
  (!!value[0] && !!value[1]) ? (
    <div className="flex mx-4 mb-8 text-left">
      <div className="w-7/12">
        <h4 className="text-xl">
          <strong>{title[0]}</strong>
        </h4>
        <h4 className="text-xl">
          {value[0]}
        </h4>
      </div>
      <div className="w-5/12 pl-4">
        <h4 className="text-xl">
          <strong>{title[1]}</strong>
        </h4>
        <h4 className="text-xl">
          {value[1]}
        </h4>
      </div>
    </div>
  ) : (!!value[0]) ? (
    <VerticalDetail
      title={title[0]}
      value={value[0]}
    />
  ) : (!!value[1]) ? (
    <VerticalDetail
      title={title[1]}
      value={value[1]}
    />
  ) : false
);

DualVerticalDetail.defaultProps = {
  value: ['',''],
};

DualVerticalDetail.propTypes = {
  title: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
};

const Notes = ({ title, text }) => (
  !!text && (
    <div className="grid-row mx-4 mb-12 text-left">
      <div className="grid-col-12">
        <h4 className="text-xl font-bold mb-2">
          {title}
        </h4>
        <p className="text-lg">
          {text}
        </p>
      </div>
    </div>
  )
);

Notes.defaultProps = {
  text: '',
};

Notes.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
};

/*
const TestingResults = ({ files }) => (
  !!files?.length && (
    <Fragment>
      <div className="grid-row mx-4 mb-4">
        <h4 className="text-xl font-bold text-left">
          Testing Results:
        </h4>
      </div>
      {files.map(file => (
        <a
          key={file.filename}
          className=""
          href={file.url}
          target="_blank"
        >
          <span className="flex mx-4 mb-2 py-2 bg-gray-100">
            <div className="w-1/4">
              <img src={DownloadIcon} alt="DownloadIcon" className="pr-2 mx-auto h-20" />
            </div>
            <div className="w-3/4">
              <div className="h-8 mt-2 text-lg text-left font-bold">
                {file.name}
              </div>
              <div className="h-8 text-lg text-left italic h-8">
                {file.filename}
              </div>
            </div>
          </span>
        </a>
      ))}
    </Fragment>
  )
);

TestingResults.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};
*/

const BlockchainAddress = ({ address }) => (
  !!address && (
    <div className="flex mx-4 p-8 mb-12 text-left bg-gray-100">
      <div className="w-full">
        <span className="flex flex-row text-xl font-bold text-gold-500">
          <span className="icon icon-blockchain mr-2 text-2xl -mb-1"></span>
          <h4 className="mb-2">
            Blockchain Address
          </h4>
        </span>
        <div className="text-xl text-gold-500 underline">
          {address.substr(0,32)+'...'}
        </div>
      </div>
    </div>
  )
);

BlockchainAddress.defaultProps = {
  address: '',
};

BlockchainAddress.propTypes = {
  address: PropTypes.string,
};

const CultivationLotDetail = ({ lot }) => (
  !!lot && (
    <div className="mb-2 mt-8">
      {!!lot?.name && (
        <div className="grid-row mx-4 mb-6 text-3xl font-bold text-left">
          {lot.name}
        </div>
      )}
      {!!lot?.organization?.name && (
        <div className="flex mx-4 mb-8 text-left">
          <div className="w-full">
            <h3 className="text-2xl mb-2 font-bold text-gold-500">
              Cultivator Name
            </h3>
            <div className="text-xl">
              {lot.organization.name}
            </div>
          </div>
        </div>
      )}
      <BlockchainAddress address={lot.address} />
      <DualVerticalDetail
        title={['Genetics:', 'Grow Type:']}
        value={[
          getLotStateField(lot, 'initial', 'strain'),
          getLotStateField(lot, 'initial', 'growType'),
        ]}
      />
      <DualVerticalDetail
        title={['Grow Medium:', 'Harvest Date:']}
        value={[
          getLotStateField(lot, 'initial', 'growMedium'),
          getLotStateField(lot, 'harvest', 'lastMaturityDate'),
        ]}
      />
      <VerticalDetail
        title="Seed Source:"
        value={getLotStateField(lot, 'initial', 'cloned') === true ? 'clone' : 
          getLotStateField(lot, 'initial', 'cloned') === false ? 'seed' : ''}
      />
      <Notes
        title="Farming Practice Notes:"
        text={getLotStateField(lot, 'grow', 'notes')}
      />
      <Notes
        title="Nutrient Cycle Notes:"
        text={getLotStateField(lot, 'grow', 'nutrientCycle')}
      />
    </div>
  )
);

CultivationLotDetail.defaultProps = {
  lot: {
    name: '',
    address: '',
    organization: {
      name: '',
    },
  },
};

CultivationLotDetail.propTypes = {
  lot: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

const ProcessingLotDetail = ({ lot }) => (
  !!lot && (
    <div className="my-2">
      <div className="grid-row mt-12 mb-8 mx-4">
        <hr/>
      </div>
      {!!lot?.name && (
        <div className="grid-row mx-4 mb-6 text-3xl font-bold text-left">
          {lot.name}
        </div>
      )}
      {!!lot?.organization?.name && (
        <div className="w-full text-left mx-4 mb-8">
          <h3 className="text-2xl mb-2 font-bold text-gold-500 text-left">
            Extractor Name
          </h3>
          <div className="text-xl text-left">
            {lot.organization.name}
          </div>
        </div>
      )}
      <DualVerticalDetail
        title={['Extraction Type:', 'Extraction Date:']}
        value={[
          getLotStateField(lot, 'extracted', 'extractionType'),
          getLotStateField(lot, 'extracted', 'extractionDate'),
        ]}
      />
    </div>
  )
);

ProcessingLotDetail.defaultProps = {
  lot: {
    name: '',
    address: '',
    organization: {
      name: '',
    },
  },
};

ProcessingLotDetail.propTypes = {
  lot: PropTypes.shape({
    name: PropTypes.string,
    address: PropTypes.string,
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

const LotDotButtons = ({ lots, lotSelected, onLotSelect }) => (
  <div className="flex justify-center mt-8">
    {lots.map((lot, index) => (
      (lotSelected === index) ? (
        <div key={index.toString()} className="mr-1 h-12">
          <div className="icon icon-circle mr-2 text-gold-500 text-xl"></div>
        </div>
      ) : (
        <div key={index.toString()} className="h-12">
          <button
            type="button"
            className=""
            onClick={() => onLotSelect(index)}
          >
            <div className="icon icon-circle-o mr-2 text-gold-500 text-xl"></div>
          </button>
        </div>
      )
    ))}
  </div>
);

LotDotButtons.propTypes = {
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  lotSelected: PropTypes.number.isRequired,
  onLotSelect: PropTypes.func.isRequired,
};

const LotDetailSwitch = ({ lots }) => {
  const [ lotSelected, setLotSelected ] = useState(0);
  const lot = (!!lots?.length) ? lots[lotSelected] : null;
  const parentLot = (!!lot?.parentLot) ? lot.parentLot : null;

  return (
    !!lots?.length && (
      <div className="mt-6">
        <div className="grid-row mt-6 mb-4">
          <h2 className="text-4xl text-center">
            Lot Information
          </h2>
        </div>
        {lots.length > 1 && (
          <p className="text-lg mx-8 mb-2 text-center font-bold">
            {`This product was compiled from the following ${lots.length} cultivation lots:`}
          </p>
        )}
        {lots.length === 1 && (
          <p className="text-lg mx-8 mb-2 text-center font-bold">
            {`This product was compiled from the following cultivation lot:`}
          </p>
        )}
        <div className="grid-row mt-8 mb-4 mx-2">
          <hr/>
        </div>
        {lots.length > 1 && (
          <LotDotButtons lots={lots} lotSelected={lotSelected} onLotSelect={setLotSelected} />
        )}
        {!!lot && !parentLot && <CultivationLotDetail lot={lot} />}
        {!!parentLot && <CultivationLotDetail lot={parentLot} />}
        {!!parentLot && <ProcessingLotDetail lot={lot} />}
        {lots.length > 1 && (
          <LotDotButtons lots={lots} lotSelected={lotSelected} onLotSelect={setLotSelected} />
        )}
      </div>
    )
  );
}

LotDetailSwitch.defaultProps = {
  lots: [],
};

LotDetailSwitch.propTypes = {
  lots: PropTypes.arrayOf(PropTypes.shape({})),
};

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

const Product = ({ product }) => (
  <div className="container w-full max-w-xl">
    <div className="grid-row m-0 p-0">
      <div className="grid-col-12">
        <ProductHeader product={product} />
        <ProductCertifications certifications={product.certifications} />
        <ProductCompany company={product.company} />
        <LotDetailSwitch lots={product.lots} />
        <ProductFooter />
      </div>
    </div>
  </div>
);

Product.defaultProps = {
  product: {
    title: '',
    description: '',
    image: [{
      url: '',
    },],
    company: {
      name: '',
      description: '',
      url: '',
      logo: {
        url: '',
      },
      location: {
        state: '',
      },
    },
    packagingDate: '',
    certifications: [],
    lots: [],
  },
};

Product.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
    company: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string,
      logo: PropTypes.shape({
        url: PropTypes.string,
      }),
      location: PropTypes.shape({
        state: PropTypes.string,
      }),
    }),
    packagingDate: PropTypes.string,
    certifications: PropTypes.arrayOf(PropTypes.string),
    lots: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string,
      organization: PropTypes.shape({
        name: PropTypes.string,
      }),
      details: PropTypes.arrayOf(PropTypes.shape({})),
      parentLot: PropTypes.shape({
        name: PropTypes.string,
        address: PropTypes.string,
        organization: PropTypes.shape({
          name: PropTypes.string,
        }),
        details: PropTypes.arrayOf(PropTypes.shape({})),
      }),
    })),
  }),
};

export default Product;
