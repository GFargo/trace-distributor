import USStates from '../../core/src/components/MultiForm/constants/USStates';

/**
 * 
 * State Helpers
 * 
 */

export const productToState = (product) => ({
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


/**
 * 
 * Lots
 * 
 */

export const deflateLots = (lotIDs, lots) => {
  const parts = {};
  lotIDs.forEach(id => { 
    if (!!lots && !!lots[id]) {
      parts[id] = deflateLotSelection(lots[id]);
    }
  })
  return parts;
}

export const inflateLots = (productState) => {
  const lots = {};
  const {
    productLot,
    productLotParts,
    additionalLots,
    additionalLotsParts,
  } = productState;

  const selection = !!productLot && inflateLotSelection(productLotParts)
  if (!!selection) {
    lots[productLot] = inflateLotSelection(productLotParts || {});
  }
  
  if(!!additionalLots) {
    additionalLots.forEach(id => {
      const selection = id !== 'IGNORE' && inflateLotSelection(additionalLotsParts[id])
      if (!!selection) lots[id] = selection;
    })
  }
  return lots;
}




/**
 * 
 * Lot Selection
 * 
 */

export const inflateLotSelection = (selection) => {
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
      if (entry === 'image') {
        lotRef.details[state].data.images = !!value ? [{ image: value }] : null
      } else {
        lotRef.details[state].data[entry] = value
      }
    }
  })

  if (!!lot.details) lot.details = Object.values(lot.details);
  if (!!lot.parentLot?.details) lot.parentLot.details = Object.values(lot.parentLot.details)

  return (Object.keys(lot).length > 0) ? lot : null;
}

export const deflateLotSelection = (lot) => {
  const parts = {};
  if (!lot) return parts;

  if (!!lot.name) parts['lot-lot-name'] = lot.name;
  if (!!lot.address) parts['lot-lot-address'] = lot.address;
  if (!!lot.organization?.name) parts['lot-org-name'] = lot.organization.name;
  if (!!lot.details?.length) {
    lot.details.forEach((detail) => {
      if (!detail.state || !detail.data) return;
      Object.keys(detail.data).forEach((key) => {
        if (key === 'images' && !!detail.data.images && !!detail.data.images.length) {
          parts[`lot-${detail.state}-image`] = detail.data.images[0].image;
        } else if (!!detail.data[key]) {
          parts[`lot-${detail.state}-${key}`] = detail.data[key];
        }
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
        if (key === 'images' && !!detail.data.images && !!detail.data.images.length) {
          parts[`parentLot-${detail.state}-image`] = detail.data.images[0].image;
        } else if (!!detail.data[key]) {
          parts[`parentLot-${detail.state}-${key}`] = detail.data[key];
        }
      })
    })
  }
  return parts;
}



/**
 * #########
 * 
 * Labels
 * 
 * #########
 */

 /**
  * Deflate label object.
  * @param {object} labelOverrides 
  */
export const deflateLabels = (labelOverrides) => {
  const overrides = {};
  Object.keys(labelOverrides).forEach(id => { 
    if (!!labelOverrides[id]) {
      overrides[id] = deflateLotSelection(labelOverrides[id]); 
    }
  })
  return overrides;
}
  
/**
 * Inflate labels object.
 * @param {object} labelOverrides 
 */
export const inflateLabels = (labelOverrides) => {
  const overrides = {};
  Object.keys(labelOverrides).forEach(id => {
    if (id !== 'IGNORE') {
      overrides[id] = inflateLotSelection(labelOverrides[id] || {});
    }
  })
  return overrides;
}


 


 /**
  * #########
  * 
  * Certifications
  * 
  * #########
  */
 export const inflateCerts = (certifications) => Object.keys(certifications).filter(key => certifications[key])

 export const deflateCerts = (certs) => {
   const certifications = {};
   certs.forEach((name) => { certifications[name] = true; })
   return certifications;
 }
 