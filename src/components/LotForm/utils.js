export const inflateLot = (data) => {
  const lot = {}
  if (!data) return null;

  Object.keys(data).filter((each) => !!each && !!data[each]).forEach((key) => {
    const keyParts = key.split('-')
    const [lotField, cat, entry] = keyParts 
    const value = !!data[key]?.value ? data[key].value : ''
    if (!value || !lotField || !cat || !entry) return
    if (lotField === 'parentLot' && !lot.parentLot) lot.parentLot = {};
    const lotRef = (lotField === 'lot') ? lot : lot.parentLot

    lotRef.state = 'harvest';
    lotRef.address = 'unverified';

    if (cat === 'lot') {
      lotRef[entry] = value

    } else if (cat === 'org') {
      if (!lotRef.organization) lotRef.organization = {}
      lotRef.organization[entry] = value

    } else {
      const state = cat;
      if (state === lotRef.state) {
        if (!lotRef.stateDetails) lotRef.stateDetails = { state, data: {} }
        lotRef.stateDetails.data[entry] = value
      }
      if (!lotRef.details) lotRef.details = {}
      if (!lotRef.details[state]) lotRef.details[state] = { state, data: {} }
      lotRef.details[state].data[entry] = value
    }
  })

  if (!!lot.details) lot.details = Object.values(lot.details);
  if (!!lot.parentLot?.details) lot.parentLot.details = Object.values(lot.parentLot.details)

  return (Object.keys(lot).length > 0) ? lot : null;
}

export const deflateLot = (lot) => {
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
  return parts;
}