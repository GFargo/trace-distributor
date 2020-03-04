import React, { useState } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

import Button from '../../core/src/components/Elements/Button';
import TextInput from '../../core/src/components/MultiForm/parts/TextInput';
import TextAreaInput from '../../core/src/components/MultiForm/parts/TextAreaInput';
import SelectDropdownInput from '../../core/src/components/MultiForm/parts/SelectDropdownInput';
import USStates from '../../core/src/components/MultiForm/constants/USStates';
import InputWrapper from '../../core/src/components/MultiForm/parts/InputWrapper';
import FileUpload from '../../components/FileUpload'
import { transformValues } from '../../core/src/components/Lots/LotStateSection/LotSectionHelpers';
import PublicProduct from '../../components/PublicProduct';
import { genProductID } from '../../services/traceFirebase';


const LOCAL_SERVER_ADDRESS = 'http://localhost:3000';
const SERVER_ADDRESS = LOCAL_SERVER_ADDRESS; // TODO Add real server address
const PRODUCT_NODE = SERVER_ADDRESS+'/product/';
const productProfileAddress = (id) => PRODUCT_NODE+id;

const getProductQRImageURL = (id) => {
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  return el.toDataURL("image/png")
};

const dlProductQRImageURL = (id, url) => {
  let downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = id+".png";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const dlProductQRImage = (id) => {
  const imageURL = getProductQRImageURL(id);
  if (!imageURL) return;
  const streamUrl = imageURL.replace("image/png", "image/octet-stream");
  dlProductQRImageURL(id, streamUrl)
};

const ProductQRCodeView = ({ url }) => (
  <div className="text-center" style={{ width: '320px' }}>
    <QRCode
      id="productQRCode"
      value={url}
      size={320}
      level={"H"}
      includeMargin={true}
    />
    <a onClick={() => dlProductQRImage('productQRCode')}>
      Download QR Code
    </a>
  </div>
);

const inflateLotSelection = (selection) => {
  const lot = {}
  Object.keys(selection).filter((each) => !!each && !!selection[each]).forEach((key) => {
    const keyParts = key.split('-')
    const [ lotField, cat, entry ] = keyParts
    const value = selection[key]
    if (!value || !lotField || !cat || !entry) return
    if (lotField === 'parentLot' && !lot.parentLot) lot.parentLot = {};
    const lotRef = (lotField === 'lot') ? lot : lot.parentLot

    if (cat === 'lot') {
      lotRef[entry] = value
    
    } else if (cat === 'org') {
      if (!lotRef.organization) lotRef.organization = {}
      lotRef.organization[entry] = value

    } else {
      const state = cat;
      if (!lotRef.details) lotRef.details = {}
      if (!lotRef.details[state]) lotRef.details[state] = { state, data: {} }
      lotRef.details[state].data[entry] = value
    }
  })

  if (!!lot.details) lot.details = Object.values(lot.details);
  if (!!lot.parentLot?.details) lot.parentLot.details = Object.values(lot.parentLot.details)

  return (Object.keys(lot).length > 0) ? lot : null;
}

const LotDetailSelector = ({ lot, selection, onToggleSelection }) => {
  const cultLot = !!lot?.parentLot ? lot.parentLot : lot;
  const lotRef = !!lot?.parentLot ? 'parentLot' : 'lot';

  const CheckboxListItem = ({ name, label, value }) => (
    <div className={"py-2 pl-6"} >
      <div className="flex flex-row custom-checkbox">
        <input 
          type="checkbox" 
          className="w-auto mr-2"
          id={lot.address+name} 
          checked={!!selection[name]} 
          onChange={() => onToggleSelection(name, value)}
        />
        <label 
          className={"custom-control-label "+(!!selection[name] ? "text-body" : "text-muted")} 
          htmlFor={lot.address+name}
        >
          <strong>{label}</strong>
          &nbsp;{value}
        </label>
      </div>
    </div>
  );

  const SectionTitle = ({ title }) => (
    <div className={"row row-sm w-100 pl-3 my-2"} >
      <h4 className="text-md font-bold text-gold-500">
        {title}
      </h4>
    </div>
  );

  const getLotStateField = (lot, state, field) => {
    const cat = !!lot.details && lot.details.find(one => one.state === state);
    const value = (!cat || !cat.data || !cat.data[field]) ? null : cat.data[field]
    return transformValues(field, value);
  }

  return (!lot) ? null : (
    <div className="my-2">
      <SectionTitle title="CULTIVATION INFORMATION (ATTRIBUTES, GROW, HARVEST)" />
      {!!cultLot.name && 
        <CheckboxListItem 
          name={lotRef+"-lot-name"}
          label="Lot Name:"
          value={cultLot.name}
        />}
      {!!cultLot.address && 
        <CheckboxListItem 
          name={lotRef+"-lot-address"}
          label="Blockchain Address:"
          value={cultLot.address}
        />}
      {!!cultLot.organization?.name && 
        <CheckboxListItem 
          name={lotRef+"-org-name"}
          label="Organization Name:"
          value={cultLot.organization.name}
        />}
      {!!getLotStateField(cultLot, 'initial', 'strain') && 
        <CheckboxListItem 
          name={lotRef+"-initial-strain"}
          label="Genetics:"
          value={getLotStateField(cultLot, 'initial', 'strain')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'growType') && 
        <CheckboxListItem 
          name={lotRef+"-initial-growType"}
          label="Grow Type:"
          value={getLotStateField(cultLot, 'initial', 'growType')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'growMedium') && 
        <CheckboxListItem 
          name={lotRef+"-initial-growMedium"}
          label="Grow Medium:"
          value={getLotStateField(cultLot, 'initial', 'growMedium')}
        />}
      {!!getLotStateField(cultLot, 'harvest', 'lastMaturityDate') && 
        <CheckboxListItem 
          name={lotRef+"-harvest-lastMaturityDate"}
          label="Harvest Date:"
          value={getLotStateField(cultLot, 'harvest', 'lastMaturityDate')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'cloned') && 
        <CheckboxListItem 
          name={lotRef+"-initial-cloned"}
          label="Seed Source:"
          value={getLotStateField(cultLot, 'initial', 'cloned')}
        />}
      {!!getLotStateField(cultLot, 'grow', 'notes') && 
        <CheckboxListItem 
          name={lotRef+"-grow-notes"}
          label="Farming Practice Notes:"
          value={getLotStateField(cultLot, 'grow', 'notes')}
        />}
      {!!getLotStateField(cultLot, 'grow', 'nutrientCycle') && 
        <CheckboxListItem 
          name={lotRef+"-grow-nutrientCycle"}
          label="Nutrient Cycle Notes:"
          value={getLotStateField(cultLot, 'grow', 'nutrientCycle')}
        />}
      {!!lot.parentLot && 
        <SectionTitle title="EXTRACTION INFORMATION" />}
      {!!lot.parentLot && !!lot.name &&
        <CheckboxListItem 
          name="lot-lot-name"
          label="Lot Name:"
          value={lot.name}
        />}
      {!!lot.parentLot && !!lot.address &&
        <CheckboxListItem 
          name="lot-lot-address"
          label="Blockchain Address:"
          value={lot.address}
        />}
      {!!lot.parentLot && !!lot.organization?.name &&
        <CheckboxListItem 
          name="lot-org-name"
          label="Organization Name:"
          value={lot.organization.name}
        />}
      {!!lot.parentLot && !!getLotStateField(lot, 'extracted', 'extractionType') &&
        <CheckboxListItem 
          name="lot-extracted-extractionType"
          label="Extraction Type:"
          value={getLotStateField(lot, 'extracted', 'extractionType')}
        />}
      {!!lot.parentLot && !!getLotStateField(lot, 'extracted', 'extractionDate') &&
        <CheckboxListItem 
          name="lot-extracted-extractionDate"
          label="Extraction Date:"
          value={getLotStateField(lot, 'extracted', 'extractionDate')}
        />}
    </div>
  )
}

const CERTIFICATIONS = ['ORGANIC', 'KOSHER', 'NONGMO', 'ADSCA'];
const CertificationCheckboxes = ({ certifications, onToggleCertification }) => (
  <InputWrapper name="productCertifications" label="Product Certifications">
    <div className={"row row-sm w-100 pl-3"} >
      {CERTIFICATIONS.map( cert => 
        <div key={cert} className="flex flex-row custom-checkbox pr-8">
          <input 
            type="checkbox" 
            className="w-auto mr-2"
            id={'certifications_'+cert} 
            checked={!!certifications[cert]} 
            onChange={() => onToggleCertification(cert)}
          />
          <label 
            className={"custom-control-label "+(!!certifications[cert] ? "text-body" : "text-muted")} 
            htmlFor={'certifications_'+cert}
          >
            {cert}
          </label>
        </div>
      )}
    </div>
  </InputWrapper>
);

const PackagingDatePicker = ({ packagingDate, onChangePackagingDate }) => (
  <InputWrapper name="packagingDate" label="Product Packaging Date">
    <div className={"row row-sm w-25 pl-3"} >
      <input 
        type="date" 
        className=""
        id="packagingDate"
        value={packagingDate}
        onChange={(event) => onChangePackagingDate(event.target.value)}
      />
    </div>
  </InputWrapper>
);


const ProductProfile = ({
  lots,
  buttonLabel,
  handleSubmit,
  errorMessage,
  isSubmitPending,
  invertColor,
}) => {
  const [state, setState] = useState({ 
    productID: '',
    name: '', 
    description: '',
    productImage: null,
    packagingDate: '',
    certifications: {},
    companyName: '',
    companyDescription: '',
    companyLogo: null,
    manufacturerLocation: '',
    productLot: null,
    productLotParts: {},
    additionalLot: null,
    additionalLotParts: {},
    previewProduct: false,
    errors: {
      name: '', 
      description: '',
      productImage: '',
      packagingDate: '',
      certifications: '',
      companyName: '',
      companyDescription: '',
      companyLogo: '',
      manufacturerLocation: '',
      productLot: '',
      additionalLot: '',
    }
  });
  const { 
    productID,
    name, 
    description,
    productImage,
    packagingDate,
    certifications,
    companyName,
    companyDescription,
    companyLogo,
    manufacturerLocation,
    productLot,
    productLotParts,
    additionalLot,
    additionalLotParts,
    previewProduct,
    errors
  } = state;
  /*
  const addError = (name, msg) => {
    if (!!name) {
      setState({ ...state, errors: { [name]: msg } });
    }
  }
  */
  const inflateLots = () => {
    const lots = [];
    const pLot = inflateLotSelection(productLotParts);
    if (!!pLot) lots.push(pLot);
    const aLot = inflateLotSelection(additionalLotParts);
    if (!!aLot) lots.push(aLot);
    return lots;
  }

  const stateToProduct = (translateImages) => ({
    id: productID,
    title: name, 
    description,
    productImage,
    image: { url: (!!productImage && translateImages) ? URL.createObjectURL(productImage) : '' },
    packagingDate,
    certifications: Object.keys(certifications).filter(key => certifications[key]),
    company: { 
      name: companyName,
      description: companyDescription,
      logo: { url: (!!companyLogo && translateImages) ? URL.createObjectURL(companyLogo) : '' },
      location: { 
        state: (!!companyName && !!manufacturerLocation) ?
          USStates.find(one => one.value === manufacturerLocation).label : '',
        country: (!!companyName) ? 'USA' : '',
      },
    },
    companyLogo,
    productLot,
    additionalLot,
    lots: inflateLots(),
    url: (!!productID) ? productProfileAddress(productID) : '',
    qrcode: (!!productID && !!getProductQRImageURL("productQRCode")) 
      ? getProductQRImageURL("productQRCode")
      : '',
  })

  const isDisabled = (!name || !productLot || !Object.values(errors).every((one) => !one))

  const product = isDisabled ? null : stateToProduct(true);
  console.log('PRODUCT ', product)

  return (
    <form>
      <div className="my-6">
        <h3 className="text-xl text-left mb-2 mt-4">
          Product Information
        </h3>
        <hr/>
      </div>

      <div className="my-4">
        <TextInput
          label="Product Name"
          name="name"
          placeholder="Enter product name"
          required
          invertColor={invertColor}
          value={name}
          error={errors.name}
          className="w-128"
          updateValueAndError={(_, name, err) =>
            setState({ ...state, name, errors: { ...state.errors, name: err || '' } })
          }
        />
      </div>

      <div className="my-4">
        <TextAreaInput
          label="Product Description"
          name="description"
          invertColor={invertColor}
          placeholder="Enter product description"
          value={description}
          error={errors.description}
          className="w-128"
          updateValueAndError={(_, description, err) =>
            setState({ ...state, description, errors: { ...state.errors, description: err || '' } })
          }
        />
      </div>

      <div className="my-4 w-50">
        <InputWrapper name="productImage" label="Product Image">
        {!!productImage
          ? <img src={URL.createObjectURL(productImage)} alt="productImage" className="w-20" />
          : <FileUpload 
              id="productImage"
              types='image/*' 
              placeholder='Choose an image to upload'
              onUploadFile={ productImage => setState({ ...state, productImage })} 
            />}
        </InputWrapper>
      </div>

      <div className="my-4">
        <PackagingDatePicker 
          packagingDate={packagingDate} 
          onChangePackagingDate={ packagingDate => setState({ 
            ...state, 
            packagingDate, 
          })}
        />
      </div>

      <div className="my-4">
        <CertificationCheckboxes 
          certifications={certifications} 
          onToggleCertification={ cert => setState({ 
            ...state, 
            certifications: { 
              ...certifications, 
              [cert]: !certifications[cert]
            }, 
          })}
        />
      </div>

      <div className="my-4">
        <TextInput
          label="Company Name"
          name="companyName"
          placeholder="Enter company name"
          invertColor={invertColor}
          value={companyName}
          error={errors.companyName}
          className="w-128"
          updateValueAndError={(_, companyName, err) =>
            setState({ ...state, companyName, errors: { ...state.errors, companyName: err || '' } })
          }
        />
      </div>
      
      <div className="my-4">
        <TextAreaInput
          label="Company Description"
          name="companyDescription"
          invertColor={invertColor}
          placeholder="Enter company description"
          value={companyDescription}
          error={errors.companyDescription}
          className="w-128"
          updateValueAndError={(_, companyDescription, err) =>
            setState({ ...state, companyDescription, errors: { ...state.errors, companyDescription: err || '' } })
          }
        />
      </div>

      <div className="my-4 w-50">
        <InputWrapper name="companyLogo" label="Company Logo">
        {!!companyLogo
          ? <img src={URL.createObjectURL(companyLogo)} className="w-20" alt="companyLogo" />
          : <FileUpload 
              id="companyLogo"
              types='image/*' 
              placeholder='Choose an image to upload'
              onUploadFile={ companyLogo => setState({ ...state, companyLogo })} 
            />}
        </InputWrapper>
      </div>

      <div className="my-4">
        <SelectDropdownInput 
          name="manufacturerLocation"
          value={manufacturerLocation}
          label="Manufacturer Location"
          error={errors.manufacturerLocation}
          options={USStates}
          updateValueAndError={(_, manufacturerLocation, err) => 
            setState({ ...state, manufacturerLocation, errors: { ...state.errors, manufacturerLocation: err || '' } })
          }
        />
      </div>

      <div className="my-4">
        <h3 className="text-xl text-left mb-2 mt-4">
          Select Product Lot
        </h3>
        <hr/>
        <p className="text-sm text-left mt-4">
          There must be a lot that has passed the "Product Ready" state in the iOS app. 
          Product information regarding this product will be pulled from this lot.
        </p>
      </div>

      <div className="my-4">
        <SelectDropdownInput 
          required
          name="productLot"
          value={productLot}
          label="Product Lot"
          error={errors.productLot}
          updateValueAndError={(name, value) => setState({ ...state, productLot: value, productID: genProductID() })} 
          options={lots.map( lot => ({
            label: lot.name,
            value: lot.address,
          }))}
          padding={'.5em'}
        />
      </div>

      {!!productLot && (
        <div className="my-4">
          <h3 className="text-xl text-left mb-2 mt-4">
            Select Product Lot Information
          </h3>
          <hr/>
          <p className="text-sm text-left mt-4">
            Select which pieces of lot information you would like to include in you product 
            profile page.
          </p>
        </div>
      )}

      {!!productLot && (
        <LotDetailSelector 
          lot={lots.find(one => one.address === productLot)}
          selection={productLotParts} 
          onToggleSelection={(key, value) => setState({ 
            ...state, 
            productLotParts: { 
              ...productLotParts, 
              [key]: (!productLotParts[key]) ? value : undefined 
            }, 
          })}
        />
      )}

      {!!productLot && (
        <div className="my-4">
          <h3 className="text-xl text-left mb-2 mt-4">
            Select Additional Product Lot (optional)
          </h3>
          <hr/>
        </div>
      )}

      {!!productLot && (
        <SelectDropdownInput 
          name="additionalLot"
          value={additionalLot}
          label="Additional Lot"
          error={errors.additionalLot}
          updateValueAndError={ (name, value) => setState({ ...state, additionalLot: value })} 
          options={lots
            .filter(each => 
              each.address !== productLot 
              && !(!!each.parentLot && each.parentLot.address === productLot)
              && !(!!each.subLots?.length && each.subLots.find(sublot => sublot.address === productLot)))
            .map( lot => ({
              label: lot.name,
              value: lot.address,
            }))}
          padding={'.5em'}
        />
      )}

      {!!additionalLot && (
        <div className="my-4">
          <h3 className="text-xl text-left mb-2 mt-4">
            Select Additional Lot Information
          </h3>
          <hr/>
          <p className="text-sm text-left mt-4">
            Select which pieces of lot information you would like to include in you product 
            profile page.
          </p>
        </div>
      )}

      {!!additionalLot && (
        <LotDetailSelector 
          lot={lots.find(one => one.address === additionalLot)}
          selection={additionalLotParts}
          onToggleSelection={(key, value) => setState({ 
            ...state, 
            additionalLotParts: { 
              ...additionalLotParts, 
              [key]: (!additionalLotParts[key]) ? value : undefined 
            }, 
          })}
        />
      )}

      <div>
        {errorMessage && (
          <span className="text-orange-500">{errorMessage}</span>
        )}
      </div>

      {!previewProduct && (
        <Button
          onClickHandler={(e) => setState({ ...state, previewProduct: true })}
          size="lg"
          type="button"
          className="uppercase mt-4"
          isDisabled={isDisabled}
        >
          Preview Product Profile
        </Button>
      )}

      {!!previewProduct && (
        <div className="my-6">
          <h3 className="text-xl text-left mb-2 mt-4">
            Product Profile Preview
          </h3>
          <hr/>
        </div>
      )}

      {!!previewProduct && (
        <div className="flex mb-8 text-left">
          <div className="w-7/12 bg-white" style={{ minWidth: "540px", maxWidth: "540px" }}>
            <PublicProduct product={product} />
          </div>
          <div className="w-5/12 ml-3">
            {!!product?.url && <ProductQRCodeView url={product.url} />}
            <Button
              onClickHandler={(e) => {
                e.preventDefault();
                if (!isDisabled) {
                  setState({ ...state, previewProduct: false })
                }
              }}
              size="md"
              type="button"
              className="uppercase mt-4 ml-10 pl-1"
              isDisabled={isDisabled}
            >
              &nbsp;Close Preview&nbsp;
            </Button>
            <Button
              onClickHandler={(e) => {
                e.preventDefault();
                if (!isDisabled) {
                  handleSubmit(stateToProduct());
                }
              }}
              size="md"
              type="button"
              color="green"
              className="uppercase mt-4 ml-10 pl-1"
              isDisabled={isDisabled}
            >
              Publish Profile
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

ProductProfile.propTypes = {
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  buttonLabel: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  isSubmitPending: PropTypes.bool.isRequired,
  invertColor: PropTypes.bool.isRequired,
}

export default ProductProfile
