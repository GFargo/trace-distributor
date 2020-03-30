import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../core/src/components/Elements/Button';
import TextInput from '../../core/src/components/MultiForm/parts/TextInput';
import TextAreaInput from '../../core/src/components/MultiForm/parts/TextAreaInput';
import SelectDropdownInput from '../../core/src/components/MultiForm/parts/SelectDropdownInput';
import USStates from '../../core/src/components/MultiForm/constants/USStates';
import InputWrapper from '../../core/src/components/MultiForm/parts/InputWrapper';
import { genProductID, getProduct } from '../../services/traceFirebase';
import FileUpload from '../FileUpload'
import QRCodeView from '../QRCodeView';
import ImageCropper from '../ImageCropper';
import LotDetailSelector from './components/LotDetailSelector';
import CertificationCheckboxes from './components/CertificationCheckboxes';
import PackagingDatePicker from './components/PackagingDatePicker';

import ProductHeaderPattern from '../../core/src/components/PublicProduct/Components/Header/ProductHeaderPattern';
import ProductHeader from '../../core/src/components/PublicProduct/Components/Header';
import ProductFooter from '../../core/src/components/PublicProduct/Components/Footer';
import ProductCertifications from '../../core/src/components/PublicProduct/Components/ProductCertifications';
import ProductCompany from '../../core/src/components/PublicProduct/Components/ProductCompany';
import LotDetails from '../../core/src/components/PublicProduct/Components/LotDetails';


const { REACT_APP_TRACE_DIRECTORY } = process.env;
const productProfileAddress = (id) => `${REACT_APP_TRACE_DIRECTORY}${id}`;

const inflateLotSelection = (selection) => {
  const lot = {}
  if (!selection) return null;

  Object.keys(selection).filter((each) => !!each && !!selection[each]).forEach((key) => {
    const keyParts = key.split('-')
    const [lotField, cat, entry] = keyParts
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

const inflateCerts = (certifications) => Object.keys(certifications).filter(key => certifications[key])

const deflateLotSelection = (lot) => {
  const parts = {};
  if (!lot) return parts;

  if (!!lot.name) parts['lot-lot-name'] = lot.name;
  if (!!lot.address) parts['lot-lot-address'] = lot.address;
  if (!!lot.organization?.name) parts['lot-org-name'] = lot.organization.name;
  if (!!lot.details?.length) {
    lot.details.forEach((detail) => {
      if (!detail.state || !detail.data) return;
      Object.keys(detail.data).forEach((key) => {
        if (!!detail.data[key]) parts[`lot-${detail.state}-${key}`] = detail.data[key];
      })
    })
  }

  if (!!lot.parentLot?.name) parts['parentLot-lot-name'] = lot.parentLot.name;
  if (!!lot.parentLot?.address) parts['parentLot-lot-address'] = lot.parentLot.address;
  if (!!lot.parentLot?.organization?.name) parts['parentLot-org-name'] = lot.parentLot.organization.name;
  if (!!lot.parentLot?.details?.length) {
    lot.parentLot.details.forEach((detail) => {
      if (!detail.state || !detail.data) return;
      Object.keys(detail.data).forEach((key) => {
        if (!!detail.data[key]) parts[`parentLot-${detail.state}-${key}`] = detail.data[key];
      })
    })
  }
  return parts;
}

const deflateCerts = (certs) => {
  const certifications = {};
  certs.forEach((name) => { certifications[name] = true; })
  return certifications;
}

const deflateLabels = (labelOverrides) => {
  const overrides = {};
  Object.keys(labelOverrides).forEach(address => { 
    if (!!labelOverrides[address]) {
      overrides[address] = deflateLotSelection(labelOverrides[address]); 
    }
  })
  return overrides;
}

const deflateLots = (lotIDs, lots) => {
  const parts = {};
  lotIDs.forEach(address => { 
    if (!!lots && !!lots[address]) {
      parts[address] = deflateLotSelection(lots[address]);
    }
  })
  return parts;
}

const productToState = (product) => ({
  productID: !!product?.id ? product.id : '',
  existingQRCode: !!product?.qrcode?.url ? product.qrcode.url : '', 
  name: !!product?.title ? product.title : '', 
  description: !!product?.description ? product.description : '', 
  productImage: {
    url: !!product?.image?.url ? product.image.url : '', 
    type: !!product?.image?.url ? 'firebase' : '',
  },
  packagingDate: !!product?.packagingDate ? product.packagingDate : '', 
  certifications: !!product?.certifications ? deflateCerts(product.certifications) : {}, 
  companyName: !!product?.company?.name ? product.company.name : '', 
  companyDescription: !!product?.company?.description ? product.company.description : '', 
  companyLogo: {
    url: !!product?.company?.logo?.url ? product.company.logo.url : '',
    type: !!product?.company?.logo?.url ? 'firebase' : '',
  },
  manufacturerLocation: (!!product?.company?.location?.state && !!USStates) ?
    USStates.find(one => one.label === product.company.location.state).value : '',
  productLot: !!product?.productLot ? product.productLot : null,
  productLotParts: (!!product?.productLot && !!product?.lots) ?
    deflateLotSelection(product.lots[product.productLot]) : {},
  additionalLots: !!product?.additionalLots ? product.additionalLots : 
    !!product?.additionalLot ? [ product.additionalLot ] : [],
  additionalLotsParts: !!product?.additionalLots ? deflateLots(product.additionalLots, product.lots) : {},
  labelOverrides: !!product?.labelOverrides ? deflateLabels(product.labelOverrides) : {},
});

class ProductProfileForm extends PureComponent {
  state = {
    productID: '',
    existingQRCode: '',
    name: '',
    description: '',
    productImage: {
      file: null,
      url: '',
      type: '',
    },
    productImageModal: false,
    packagingDate: '',
    certifications: {},
    companyName: '',
    companyDescription: '',
    companyLogo: {
      file: null,
      url: '',
      type: '',
    },
    manufacturerLocation: '',
    productLot: null,
    productLotParts: {},
    additionalLots: [],
    additionalLotsParts: {},
    labelOverrides: {},
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
  }

  componentDidMount() {
    const { populateFromID } = this.props;

    if (!!populateFromID) {
      
      getProduct(populateFromID, 
        (product) => this.setState( state => ({ ...state, ...productToState(product) }))
        //(product) => console.log('Cloning from Product: ', product)
      );
    } else {
      const productID = genProductID();
      this.setState({ ...this.state, productID })
      //console.log('New Product ID: ', newID)
    }
  }

  inflateLots = () => {
    const lots = {};
    const selection = !!this.state.productLot && inflateLotSelection(this.state.productLotParts)
    if (!!selection) {
      lots[this.state.productLot] = inflateLotSelection(this.state.productLotParts || {});
    }
    
    this.state.additionalLots.forEach(address => {
      const selection = address !== 'IGNORE' && inflateLotSelection(this.state.additionalLotsParts[address])
      if (!!selection) lots[address] = selection;
    })
    return lots;
  }

  inflateLabels = () => {
    const overrides = {};
    Object.keys(this.state.labelOverrides).forEach(address => {
      if (address !== 'IGNORE') {
        overrides[address] = inflateLotSelection(this.state.labelOverrides[address] || {});
      }
    })
    return overrides;
  }

  getProductQRDataURL = () => {
    const el = document.getElementById("productQRCode");
    if (!el) return '';
    const url = el.toDataURL("image/png")
    return url || ''
  }

  stateToProduct = (submit) => ({
    id: this.state.productID,
    title: this.state.name,
    description: this.state.description,
    productImage: this.state.productImage,
    image: { 
      url: (!!this.state.productImage?.url && !submit) ? this.state.productImage.url : '',
    },
    packagingDate: this.state.packagingDate,
    certifications: inflateCerts(this.state.certifications),
    companyLogo: this.state.companyLogo,
    company: {
      name: this.state.companyName,
      description: this.state.companyDescription,
      logo: {
        url: (!!this.state.companyLogo?.url && !submit) ? this.state.companyLogo.url : '' 
      },
      location: {
        state: (!!this.state.manufacturerLocation && !!USStates) ?
          USStates.find(one => one.value === this.state.manufacturerLocation).label : '',
        country: (!!this.state.manufacturerLocation) ? 'USA' : '',
      },
    },
    productLot: this.state.productLot,
    additionalLots: this.state.additionalLots.filter(each => !!each && each !== 'IGNORE'),
    labelOverrides: this.inflateLabels(),
    lots: this.inflateLots(),
    url: (!!this.state.productID) ? productProfileAddress(this.state.productID) : '',
    qrcode: (!this.state.existingQRCode && !!submit) ? this.getProductQRDataURL() : '',
    existingQRCode: this.state.existingQRCode
  })

  remainingLotsToSelect = (selected) => {
    const { lots } = this.props;
    const { productLot, additionalLots } = this.state;
    const lotsIncluded = [ productLot, ...additionalLots ]

    return lots.filter(lot => lot.address === selected || (
        !lotsIncluded.find(address => address === lot.address)
        && !(!!lot.parentLot && lotsIncluded.find(address => address === lot.parentLot.address))
        && !(!!lot.subLots?.length && lot.subLots.find(sublot => 
          lotsIncluded.find(address => address === sublot.address)))
      )
    )
  }

  render() {
    const { 
      lots, 
      handleSubmit,
      invertColor,
      errorMessage
    } = this.props;

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
      additionalLots,
      additionalLotsParts,
      labelOverrides,
      previewProduct,
      errors
    } = this.state;

    const isDisabled = (!name || !productLot || !Object.values(errors).every((one) => !one))

    const product = isDisabled ? null : this.stateToProduct();
    //console.log('STATE ', this.state)
    //console.log('PRODUCT ', product)

    const lotsLeft = this.remainingLotsToSelect()
    //console.log('lotsLeft ', lotsLeft)

    const selectedLots = [...additionalLots]
    if (!!lotsLeft.length) {
      selectedLots.push('')
    }

    return (
      <form>
  
        <div className="my-6">
          <h3 className="text-xl text-left mb-2 mt-4">
            Product Information
          </h3>
          <hr />
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
            className="w-100 hover:border-gray-500"
            updateValueAndError={(_, name, err) =>
              this.setState({ ...this.state, name, errors: { ...this.state.errors, name: err || '' } })
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
            className="w-100 hover:border-gray-500"
            updateValueAndError={(_, description, err) =>
              this.setState({ ...this.state, description, errors: { ...this.state.errors, description: err || '' } })
            }
          />
        </div>

        <div className="my-4 w-100">
          <InputWrapper name="productImage" label="Product Image">
            {(!!productImage?.file && productImage.type === 'raw') ? (
               <ImageCropper 
                  className=""
                  image={URL.createObjectURL(productImage.file)}
                  onCroppedInage={file => this.setState({ ...this.state, productImage: { 
                    file, 
                    url: (!!file)? URL.createObjectURL(file) : '', 
                    type: (!!file)? 'file' : '' 
                  } })} 
                />
            ) : !!productImage?.url ? (
              <img
                src={productImage.url}
                alt="productImage"
                className="w-32 rounded-full"
                onClick={() => this.setState({ ...this.state, productImage: { 
                  file: null, 
                  url: '', 
                  type: '' 
                } })}
              />
            ) : (
              <FileUpload
                id="productImage"
                types='image/*'
                placeholder='Choose an image to upload'
                buttonText="Upload Image"
                uploadImmediately
                onUploadFile={file => this.setState({ ...this.state, productImage: { 
                  file, 
                  url: '', 
                  type: 'raw' 
                } })}
              />
            )}
          </InputWrapper>
        </div>

        <div className="my-4">
          <PackagingDatePicker
            packagingDate={packagingDate}
            onChangePackagingDate={packagingDate => this.setState({
              ...this.state,
              packagingDate,
            })}
          />
        </div>

        <div className="my-4">
          <CertificationCheckboxes
            certifications={certifications}
            onToggleCertification={cert => this.setState({
              ...this.state,
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
            className="w-100 hover:border-gray-500"
            updateValueAndError={(_, companyName, err) =>
              this.setState({ ...this.state, companyName, errors: { ...this.state.errors, companyName: err || '' } })
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
            className="w-100 h-200 hover:border-gray-500"
            updateValueAndError={(_, companyDescription, err) =>
              this.setState({ ...this.state, companyDescription, errors: { ...this.state.errors, companyDescription: err || '' } })
            }
          />
        </div>

        <div className="my-4 w-100">
          <InputWrapper name="companyLogo" label="Company Logo">
            {(!!companyLogo?.file && companyLogo.type === 'raw') ? (
               <ImageCropper 
                  className=""
                  image={URL.createObjectURL(companyLogo.file)}
                  onCroppedInage={file => this.setState({ ...this.state, companyLogo: { 
                    file, 
                    url: (!!file)? URL.createObjectURL(file) : '', 
                    type: (!!file)? 'file' : '' 
                  } })} 
                />
            ) : !!companyLogo?.url ? (
              <img
                src={companyLogo.url}
                alt="companyLogo"
                className="w-32 rounded-full"
                onClick={() => this.setState({ ...this.state, companyLogo: { 
                  file: null, 
                  url: '', 
                  type: '' 
                } })}
              />
            ) : (
              <FileUpload
                id="companyLogo"
                types='image/*'
                placeholder='Choose an image to upload'
                buttonText="Upload Image"
                uploadImmediately
                onUploadFile={file => this.setState({ ...this.state, companyLogo: { 
                  file, 
                  url: '', 
                  type: 'raw' 
                } })}
              />
            )}
          </InputWrapper>
        </div>

        {!!productID && (//this a fix with cloning existing product profiles. Don't ask questions! :)
          <div className="my-4">
            <SelectDropdownInput
              name="manufacturerLocation"
              value={manufacturerLocation}
              label="Manufacturer Location"
              className="w-100 h-200 hover:border-gray-500"
              error={errors.manufacturerLocation}
              options={USStates}
              updateValueAndError={(_, manufacturerLocation, err) =>
                this.setState({ ...this.state, manufacturerLocation, errors: { ...this.state.errors, manufacturerLocation: err || '' } })
              }
            />
          </div>
        )}

        <div className="my-4">
          <h3 className="text-xl text-left mb-2 mt-4">
            Select Product Lot
          </h3>
          <hr />
          <p className="text-sm text-left mt-4">
            There must be a lot that has passed the "Product Ready" state in the iOS app.
            Product information regarding this product will be pulled from this lot.
          </p>
        </div>

        {!!productID && (//this a fix with cloning existing product profiles. Don't ask questions! :)
          <div className="my-4">
            <SelectDropdownInput
              required
              name="productLot"
              value={productLot}
              label="Product Lot"
              className="w-100 h-200 hover:border-gray-500"
              error={errors.productLot}
              updateValueAndError={(name, value) => this.setState({ ...this.state, productLot: value, productLotParts: {} })}
              options={this.remainingLotsToSelect(productLot).map(lot => ({
                label: lot.name,
                value: lot.address,
              }))}
              padding={'.5em'}
            />
          </div>
        )}

        {!!productLot && (
          <div className="my-4">
            <h3 className="text-xl text-left mb-2 mt-4">
              Select Product Lot Information
            </h3>
            <hr />
            <p className="text-sm text-left mt-4">
              Select which pieces of lot information you would like to include in you product
              profile page.
            </p>
          </div>
        )}

        {!!productLot && (
          <LotDetailSelector
            lot={lots.find(one => one.address === productLot)}
            labelOverrides={labelOverrides[productLot] || {}}
            onOverrideLabel={(name, value) => {
              const overrides = (!!labelOverrides[productLot]) ? { ...labelOverrides[productLot] } : {}
              overrides[name] = value || '';
              this.setState({ ...this.state, 
                labelOverrides: {
                  ...labelOverrides,
                  [productLot]: overrides
                } 
              })
            }}
            selection={productLotParts}
            onToggleSelection={(key, value) => this.setState({
              ...this.state,
              productLotParts: {
                ...productLotParts,
                [key]: (!productLotParts[key]) ? value : undefined
              },
            })}
          />
        )}

        {!!productLot && (
          selectedLots.map((address, index) => address !== 'IGNORE' && (
            <div key={index.toString()}>
              <div className="my-4">
                <h3 className="text-xl text-left mb-2 mt-4">
                  Select Additional Product Lot (optional)
                </h3>
                <hr />
              </div>

              <span>
                <SelectDropdownInput
                  name={"additionalLot"+index}
                  value={address}
                  label="Additional Lot"
                  error={''}
                  updateValueAndError={(name, value) => {
                    if (!!value && value !== address && name === "additionalLot"+index) {
                      this.setState(state => {
                        const _lots = [
                          ...state.additionalLots
                        ]
                        _lots[index] = value

                        const _lotsParts = {
                          ...state.additionalLotsParts
                        }
                        if (!_lotsParts[value]) _lotsParts[value] = {}

                        return ({ 
                          ...state,
                          additionalLots: _lots,
                          additionalLotsParts: _lotsParts
                        })
                      })
                    }
                  }}
                  options={this.remainingLotsToSelect(address).map(lot => ({
                    label: lot.name,
                    value: lot.address,
                  }))}
                  padding={'.5em'}
                />
                {!!address && (
                  <span className="" data-toggle="tooltip" data-placement="top" title="Remove Lot">
                    <Button
                      className="-ml-2 text-sm text-gold-500 hover:text-gold-900"
                      color="transparent"
                      onClickHandler={() => 
                        this.setState(state => {
                          const _lots = [
                            ...state.additionalLots
                          ]
                          _lots[index] = 'IGNORE'

                          return ({ 
                            ...state,
                            additionalLots: _lots,
                          })
                        })
                      }>
                      Remove Lot
                    </Button>
                  </span>
                )}
              </span>

              {!!address && (
                <div className="mb-4">
                  <h3 className="text-xl text-left mb-2 mt-4">
                    Select Additional Lot Information
                  </h3>
                  <hr />
                  <p className="text-sm text-left mt-4">
                    Select which pieces of lot information you would like to include in you product
                    profile page.
                  </p>
                </div>
              )}

              {!!address && (
                <LotDetailSelector
                  lot={lots.find(one => one.address === address)}
                  labelOverrides={labelOverrides[address] || {}}
                  onOverrideLabel={(name, value) => {
                    const overrides = (!!labelOverrides[address]) ? { ...labelOverrides[address] } : {}
                    overrides[name] = value || '';
                    this.setState({ ...this.state, 
                      labelOverrides: {
                        ...labelOverrides,
                        [address]: overrides
                      } 
                    })
                  }}
                  selection={additionalLotsParts[address] || {}}
                  onToggleSelection={(key, value) => this.setState(state => ({
                    ...state,
                    additionalLotsParts: { 
                      ...state.additionalLotsParts,
                      [address]: (!!state.additionalLotsParts[address]) ? {
                        ...state.additionalLotsParts[address],
                        [key]: (!state.additionalLotsParts[address][key]) ? value : undefined
                      } : {
                        [key]: value
                      }
                    }
                  }))}
                />
              )}
            </div>
          ))
        )}

        <div>
          {errorMessage && (
            <span className="text-orange-500">{errorMessage}</span>
          )}
        </div>

        {!previewProduct && (
          <Button
            onClickHandler={(e) => this.setState({ ...this.state, previewProduct: true })}
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
            <hr />
          </div>
        )}
        {!!previewProduct && (
          <div className="flex container mb-8">
            <div className="w-7/12 bg-white shadow-lg" style={{ minWidth: "448px", maxWidth: "448px" }}>
              <ProductHeaderPattern>
                <div className="grid-row m-0 pt-20">
                  <div className="grid-col-12">
                    <ProductHeader product={product} />
                    {!!product.certifications && <ProductCertifications certs={product.certifications} />}
                    {!!product.company && <ProductCompany company={product.company} />}
                    {!!product.lots && <LotDetails lots={product.lots} labels={product.labelOverrides} />}
                    <ProductFooter />
                  </div>
                </div>
              </ProductHeaderPattern>
            </div>
            <div className="w-5/12 ml-6">
              {!!product.url && <QRCodeView url={product.url} name="productQRCode" />}
              <Button
                onClickHandler={(e) => {
                  e.preventDefault();
                  if (!isDisabled) {
                    this.setState({ ...this.state, previewProduct: false })
                  }
                }}
                size="md"
                type="button"
                className="uppercase mt-4 ml-20"
                isDisabled={isDisabled}
              >
                &nbsp;Close Preview&nbsp;
            </Button>
              <Button
                onClickHandler={(e) => {
                  e.preventDefault();
                  if (!isDisabled) {
                    handleSubmit(this.stateToProduct(true));
                  }
                }}
                size="md"
                type="button"
                color="green"
                className="uppercase mt-4 ml-20"
                isDisabled={isDisabled}
              >
                Publish Profile
            </Button>
            </div>
          </div>
        )}
      </form>
    );
  }
}

ProductProfileForm.defaultProps = {
  populateFromID: '',
  invertColor: false,
  errorMessage: '',
};

ProductProfileForm.propTypes = {
  populateFromID: PropTypes.string,
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  invertColor: PropTypes.bool,
}

export default ProductProfileForm;
