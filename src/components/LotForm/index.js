import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../../core/src/components/Elements/Button';

import { genLotID } from '../../services/traceFirebase';
import MultiForm from '../../core/src/components/MultiForm';
import { combineFormDataStructures }  from '../../core/src/components/MultiForm/util/field-helpers';
import unverifiedLot from '../../configs/multiform/unverifiedLot';
//import FileUpload from '../FileUpload';
//import ImageCropper from '../ImageCropper';

const inflateLot = (data) => {
  const lot = {}
  if (!data) return null;

  Object.keys(data).filter((each) => !!each && !!data[each]).forEach((key) => {
    const keyParts = key.split('-')
    const [lotField, cat, entry] = keyParts 
    const value = data[key] ? data[key] : ''
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

const deflateLot = (lot) => {
  const parts = {};
  if (!lot) return parts;

  if (!!lot.name) parts['lot-lot-name'] = lot.name;
  if (!!lot.totalSupply) parts['lot-lot-totalSupply'] = lot.totalSupply;
  if (!!lot.forSale) parts['lot-lot-forSale'] = lot.forSale;
  //if (!!lot.address) parts['lot-lot-address'] = lot.address;
  if (!!lot.organization?.name) parts['lot-org-name'] = lot.organization.name;
  if (!!lot.details?.length) {
    lot.details.forEach((detail) => {
      if (!detail.state || !detail.data) return;
      Object.keys(detail.data).forEach((key) => {
        if (!!detail.data[key]) parts[`lot-${detail.state}-${key}`] = detail.data[key];
      })
    })
  }
  /*
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
  */

  const formData = combineFormDataStructures(parts, unverifiedLot);
  console.log('MOUNT formData ', formData)
  return formData;
}

class LotForm extends PureComponent {
  state = {
    id: '',
    formData: {},
    errors: {
      name: '',
      parentLot: '',
    }
  }

  componentDidMount() {
    const { populateFromID, lots } = this.props;
    console.log('MOUNT STATE ', this.state)

    const populateLot = (!!populateFromID) ? lots.find(lot => populateFromID === lot.id) : null;

    if (!!populateLot) {
      this.setState( state => ({ ...state, id: populateLot.id, formData: deflateLot(populateLot) }))
      //console.log('populateLot: ', populateLot)

    } else {
      const id = genLotID();
      this.setState({ ...this.state, id })
      //console.log('New Lot ID: ', newID)
    }
  }

  render() {
    const { 
      lots, 
      handleSubmit,
      invertColor,
      errorMessage
    } = this.props;

    const {
      id,
      formData,
      errors
    } = this.state;

    const isDisabled = (!formData || !formData['lot-lot-name'] || !Object.values(errors).every((one) => !one))
    console.log('STATE ', this.state)
    console.log('LOT ', inflateLot(formData))

    return (
      <div>
        <MultiForm
          enableDebug
          onCloseRedirect="/distributor/lots"
          onUpdate={ data => this.setState({ ...this.state, formData: data })}
          onSubmit={ data => !!formData['lot-lot-name'] && handleSubmit({ id, ...inflateLot(data) }) }
          saveOnStepChange={true}
          formData={formData}
          sidebar={false}
          {...unverifiedLot}
        />
      </div>
    );
  }
}

LotForm.defaultProps = {
  populateFromID: '',
  invertColor: false,
  errorMessage: '',
};

LotForm.propTypes = {
  populateFromID: PropTypes.string,
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  invertColor: PropTypes.bool,
}

export default LotForm;
