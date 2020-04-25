import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button, FileUpload, ImageCropper, Loader, Accordion } from '../../core/src/components/Elements';

import TextInput from '../../core/src/components/MultiForm/parts/TextInput';
import TextAreaInput from '../../core/src/components/MultiForm/parts/TextAreaInput';
import SelectDropdownInput from '../../core/src/components/MultiForm/parts/SelectDropdownInput';
import USStates from '../../core/src/components/MultiForm/constants/USStates';
import InputWrapper from '../../core/src/components/MultiForm/parts/InputWrapper';

import { genProductID } from '../../services/traceFirebase';

import QRCodeView from '../QRCodeView';

import LotDetailSelector from './components/LotDetailSelector';
import CertificationCheckboxes from './components/CertificationCheckboxes';
import PackagingDatePicker from './components/PackagingDatePicker';
import ProductPreview from './components/ProductPreview';

import {
  productToState,
  inflateCerts,
  inflateLabels,
  inflateLots,
} from './utils';



const TRACE_DIRECTORY =
  process.env.REACT_APP_TRACE_DIRECTORY ||
  'https://develop.trace.directory/lot/';
  
const productProfileAddress = (id) => `${TRACE_DIRECTORY}${id}`;

const initialState = {
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
  },
};

class ProductProfileForm extends PureComponent {

  constructor(props) {
    super(props);
    
    const { populateFromProduct } = props;

    this.state = initialState;


    if (!!populateFromProduct) {
      this.state = { ...this.state, ...productToState(populateFromProduct) }
    } else {
      this.state.productID = genProductID();
    }
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
    labelOverrides: inflateLabels(this.state.labelOverrides),
    lots: inflateLots(this.state),
    url: (!!this.state.productID) ? productProfileAddress(this.state.productID) : '',
    qrcode: (!this.state.existingQRCode && !!submit) ? this.getProductQRDataURL() : '',
    existingQRCode: this.state.existingQRCode
  })

  remainingLotsToSelect = (myID) => {
    const { lots } = this.props;
    const { productLot, additionalLots } = this.state;
    let remainingLots = [];
    if (!lots || !lots.length) {
      return remainingLots;
    } else if (!productLot) {
      remainingLots = lots;
    } else {
      const lotsIncluded = [ productLot, ...additionalLots ];
      remainingLots = lots
        .filter(lot => 
          (!!myID && lot.id === myID) || (
            !lotsIncluded.find(id => id === lot.id)
            && !(!!lot.parentLot && lotsIncluded.find(id => id === lot.parentLot.id))
            && !(!!lot.subLots?.length && lot.subLots.find(sublot => 
              lotsIncluded.find(id => id === sublot.id))
          ))
        );
    }
    return remainingLots.map(lot => ({ label: lot.name, value: lot.id }));
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
    // console.log('STATE ', this.state)
    // console.log('PRODUCT ', product)

    const lotsLeft = this.remainingLotsToSelect();
    // console.log('lotsLeft ', lotsLeft)

    const selectedLots = [...additionalLots]
    if (!!lotsLeft.length) {
      selectedLots.push('')
    }

    return (
      <form className="flex flex-col lg:flex-row">
  
        <div className="w-full order-2 lg:order-1 lg:w-1/2">
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
              There must be a lot that has passed the &quot;Product Ready&quot; state in the iOS app.
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
                options={this.remainingLotsToSelect(productLot)}
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

          {!!lots && !!productLot && (
            <LotDetailSelector
              lot={lots.find(one => one.id === productLot) || {}}
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
            selectedLots.map((id, index) => id !== 'IGNORE' && (
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
                    value={id}
                    label="Additional Lot"
                    error={''}
                    updateValueAndError={(name, value) => {
                      if (!!value && value !== id && name === "additionalLot"+index) {
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
                    options={this.remainingLotsToSelect(id)}
                    padding={'.5em'}
                  />
                  {!!id && (
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

                {!!id && (
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

                {!!lots && !!id && (
                  <LotDetailSelector
                    lot={lots.find(one => one.id === id) || {}}
                    labelOverrides={labelOverrides[id] || {}}
                    onOverrideLabel={(name, value) => {
                      const overrides = (!!labelOverrides[id]) ? { ...labelOverrides[id] } : {}
                      overrides[name] = value || '';
                      this.setState({ ...this.state, 
                        labelOverrides: {
                          ...labelOverrides,
                          [id]: overrides
                        } 
                      })
                    }}
                    selection={additionalLotsParts[id] || {}}
                    onToggleSelection={(key, value) => this.setState(state => ({
                      ...state,
                      additionalLotsParts: { 
                        ...state.additionalLotsParts,
                        [id]: (!!state.additionalLotsParts[id]) ? {
                          ...state.additionalLotsParts[id],
                          [key]: (!state.additionalLotsParts[id][key]) ? value : undefined
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
          <div className="w-full block lg:hidden">
            <Accordion
              header="Product Profile Preview"
              headerClassName="text-lg xl:text-xl mb-2 mt-4"
            >
              {product && (
                <div className="p-4">
                  <ProductPreview product={product} />
                </div>
              )}
            </Accordion>
          </div>
        </div>
        
        <div className="w-full order-1 lg:order-2 lg:w-1/2 lg:pl-12 xl:pl-32">
          <div className="mx-auto lg:max-w-md lg:-mt-32">          
            <div className="flex flex-col lg:mb-8">
              <div className="flex mb-t py-4 w-full justify-between">
                <Button
                    type="link"
                    size="lg"
                    to="/distributor/product-profiles/"
                    color="gold"
                    className="uppercase flex justify-center flex-grow mr-2"
                  >
                    Back
                </Button>
                <Button
                    onClickHandler={(e) => {
                      e.preventDefault();
                      if (!isDisabled) {
                        handleSubmit(this.stateToProduct(true));
                      }
                    }}
                    size="lg"
                    type="button"
                    color="green"
                    className="uppercase flex justify-center flex-grow"
                    isDisabled={isDisabled}
                  >
                    Publish Profile
                </Button>
              </div>
              <div className="flex flex-col lg:mb-8 items-center">
                <div className="w-full">
                  <Accordion
                    header="QR Code Preview"
                    headerClassName="text-lg xl:text-xl mb-2 mt-4"
                  >
                    <div className="p-4">
                      {product && !!product.url ? (
                        <QRCodeView url={product.url} name="productQRCode" />
                      ) : (
                        <div className="py-6 bg-white">
                          <Loader />
                        </div>
                      )}
                    </div>
                  </Accordion>
                </div>

                <div className="w-full hidden lg:block">
                  <Accordion
                    header="Product Profile Preview"
                    headerClassName="text-lg xl:text-xl mb-2 mt-4"
                  >
                    {product && (
                      <div className="p-4">
                        <ProductPreview product={product} />
                      </div>
                    )}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>
    );
  }
}

ProductProfileForm.defaultProps = {
  invertColor: false,
  errorMessage: '',
};

ProductProfileForm.propTypes = {
  populateFromProduct: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.bool,
  ]).isRequired,
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  invertColor: PropTypes.bool,
}

export default ProductProfileForm;
