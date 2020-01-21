import 'whatwg-fetch'

//const DEV_SERVER_HOST = "https://trace-backend-dev.herokuapp.com";
const DEV_SERVER_HOST = "http://trace-backend-dev-pr-204.herokuapp.com";

const DEV_GRAPHQL_PATH = DEV_SERVER_HOST + "/graphql/";
const JSON_HEADER = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}

const fetchQuery = async (query) => {
  const response = await fetch(DEV_GRAPHQL_PATH, {
    method: "POST",
    headers: {...JSON_HEADER},
    body: JSON.stringify({query})
  })
  const result = await response.json()
  //console.log('fetchQuery: ', result)

  if (!!result && !!result.errors) console.error('fetchQuery errors: ', result.errors)
  else return (!!result && !!result.data && !result.errors) ? result.data : []
}

const lotTypes = {
  LotState: [
    'new', 'initial', 'grow', 'harvest', 'extracting', 'extracted', 'testing', 'tested', 'product', 'complete'
  ],
  StrainType: [
    'sativa', 'indica', 'hybrid'
  ],
  GrowType: [ 
    'indoor', 'outdoor', 'greenhouse'
  ],
  GrowMedium: [
    'soil', 'hydroponic'
  ],
  ExtractType: [
    'bho', 'pho', 'bhopho', 'super-critical-co2', 'sub-critical-co2', 'rso', 'rosin', 'tincture', 'fractional-distillate', 
    'water-hash', 'dry-sift', 'dry-ice-hash', 'ethanol'
  ],
  WinterType: [
    'decarboxylation', 'fractional-distillate', 'super-crticial-fluid',  'chromatography', 'rotary-evaporation'
  ],
  SampleType: [
    'flower', 'oil'
  ],
  ProfileType: [
    'ND', 'LOQ', 'NT'
  ],
  UserPermType: [
    'read', 'write', 'transfer'
  ]
}

/* GraphQL Type Fragments */
/* Notes:  
  - error on (state data) HarvestData.productImage, removed
  - unable to test states not in dev test data: Tested, Product, Complete
  - OrgStub used to bypass Auth reuirements for now
  - Add more to non-Auth Org Stub
  - errors with null query variables
*/

const INITIAL_STATE_TYPE = `
  fragment IntitalType on InitialData {
    strain
    strainType
    datePlanted
    location
    cloned
    growType
    growMedium
    seedOrCloneAmount
    images {
      image {
        hash
        url
      }
      caption
    }
  }
`

const GROW_STATE_TYPE = `
  fragment GrowType on GrowData {
    minTemp
    maxTemp
    floweringDate
    notes
    minHumidity
    maxHumidity
    nutrientCycle
    images {
      image {
        hash
        url
      }
      caption
    }
  }
`

const HARVEST_STATE_TYPE = `
  fragment HarvestType on HarvestData {
    lastMaturityDate
    minTemp
    maxTemp
    lastDateDrying
    firstDateDrying
    minHumidity
    maxHumidity
    averageHumidity
    averageTemperature
    yield
    images {
      image {
        hash
        url
      }
      caption
    }
    dryingMethod
  }
`

const EXTRACTING_STATE_TYPE = `
  fragment ExtractingType on ExtractingData {
    extractionType
    mailingDate
    notes
  }
`

const EXTRACTED_STATE_TYPE = `
  fragment ExtractedType on ExtractedData {
    preGrindingMass
    postGrindingMass
    grindingMoisture
    nugTrimRatio
    extractionType
    extractionDate
    preExtractionMass
    postExtractionMass
    wasteMaterialMass
    extractionEfficiency
    notes
    preWinterizationMass
    postWinterizationMass
    solventVolume
    winterizationEfficiency
    additionalExtraction
    preAdditionalExtractionMass
    postAdditionalExtractionMass
    additionalExtractionEfficiency
    addedTerpenesDescription
    terpenesVolume
    terpenesWeight
    images {
      image {
        hash
        url
      }
      caption
    }
  }
`

const TESTING_STATE_TYPE = `
  fragment TestingType on TestingData {
    sampleSize
    sampleMailingDate
    notes
  }
`

const TESTED_STATE_TYPE = `
  fragment TestedType on TestedData {
    testType
    sampleType
    testDate
    sampleWeight
    cbdaProfile {
      percentage
      mass
    }
    thcaProfile {
      percentage
      mass
    }
    thcProfile {
      percentage
      mass
    }
    cbnProfile {
      percentage
      mass
    }
    potentialCBDProfile {
      percentage
      mass
    }
    potentialTHCProfile {
      percentage
      mass
    }
    terpeneContent
    microbialContent
    mycotoxin
    bacteria
    yeast
    mold
    ecoli
    salmonella
    pesticide
    moisture
    heavyMetals
    images {
      image {
        hash
        url
      }
      caption
    }
    productImage {
      hash
      url
    }
  }
`

const PRODUCT_STATE_TYPE = `
  fragment ProductType on ProductData {
    notes
  }
`

const COMPLETED_STATE_TYPE = `
  fragment CompletedType on CompletedData {
    product
  }
`

const LOT_STATE_DETAILS_TYPE = `
  fragment LotStateDetailsType on LotStateDetails {
    state
    infoFileHash
    data {
      ... IntitalType
      ... GrowType
      ... HarvestType
      ... ExtractingType
      ... ExtractedType
      ... TestingType
      ... TestedType
      ... ProductType
      ... CompletedType
    }
  }
  ${INITIAL_STATE_TYPE}
  ${GROW_STATE_TYPE}
  ${HARVEST_STATE_TYPE}
  ${EXTRACTING_STATE_TYPE}
  ${EXTRACTED_STATE_TYPE}
  ${TESTING_STATE_TYPE}
  ${TESTED_STATE_TYPE}
  ${PRODUCT_STATE_TYPE}
  ${COMPLETED_STATE_TYPE}
`

const USER_TYPE_STUB = `
  fragment UserTypeStub on User {
    firstName
    lastName
    role
  }
`

const DEVICE_TYPE = `
  fragment DeviceType on Device {
    name
    address
    owner {
      firstName
      lastName
      role
    }
  }
`

const ORG_TYPE_NO_LOTS = `
  fragment OrgTypeNoLots on Organization {
    id
    name
    infoHash
    address
    owner {
      ...UserTypeStub
    }
    domain
    location {
      state
      address1
      address2
      zipcode
    }
    roles {
      identifier
      label
    }
    verified
    users {
      ...UserTypeStub
    }
    devices {
      ...DeviceType
    }
    deviceAccessRequests {
      ...DeviceType
    }
    lotFactory {
      address
      version
    }
    permit {
      photoID
      licenseNumber
      permitHolderName
    }
    statistics {
      lots {
        state
        count
      }
      users
      devices
    }
  }
  ${USER_TYPE_STUB}
  ${DEVICE_TYPE}
`

const ORG_TYPE_LOT_STUB = `
  fragment OrgTypeLotStub on Organization {
    ...OrgTypeNoLots
    lots {
      name
      address
    }
  }
  ${ORG_TYPE_NO_LOTS}
`

const ORG_TYPE_STUB = `
  fragment OrgStub on Organization {
    name
  }
`

const LOT_TYPE = `
  fragment LotType on Lot {
    name
    address
    organization {
      ...OrgStub
    }
    state
    stateDetails {
      ...LotStateDetailsType
    }
    details {
      ...LotStateDetailsType
    }
    totalSupply
    forSale
    subLots {
      name
      address
    }
    parentLot {
      name
      address
    }
    hasParent
    url
    created
  }
  ${LOT_STATE_DETAILS_TYPE}
  ${ORG_TYPE_STUB}
`

const ORG_TYPE_LOT_FULL = `
  fragment OrgTypeLotFull on Organization {
    ...OrgTypeNoLots
    lots {
      ...LotType
    }
  }
  ${ORG_TYPE_NO_LOTS}
  ${LOT_TYPE}
`

const USER_TYPE = `
  fragment UserType on User {
    firstName
    lastName
    role
    organization {
      ...OrgTypeLotFull
    }
    authToken
  }
  ${ORG_TYPE_LOT_FULL}
`

const STATISTICS_TYPE = `
  fragment StatisticsType on ApplicationStatistics {
    lots {
      state
      count
    }
    organizations {
      role
      count
    }
  }
`

const PRODUCT_TYPE = `
  fragment ProductType on Product {
    id
    company {
      name
      logo
    }
    title
    image {
      hash
      url
    }
    created
    dnaReportUrl
  }
`

const PERMIT_TYPE = `
  fragment PermitType on Permit {
    id
    created
    status
    period {
      start
      end
    }
    history {
      status
      created
      details
    }
    details
  }
`


/* GraphQL Queries */
/*
  Notes:
    - regulator login removed

*/

const IS_EXISTING_USER = (email) => `{
    isExistingUser(email: "${email}") {
      exists
    }
  }
`

const IS_EXISTING_DEVICE = (address) => `{
    isExistingDevice(address: "${address}") {
      exists
    }
  }
`

const LOT = (address) => `{
    lot(address: "${address}") {
      ...LotType
    }
  }
  ${LOT_TYPE}
`

const ALL_LOTS = `{
    lots {
      ...LotType
    }
  }
  ${LOT_TYPE}
`

const LOTS = (query, pagination) => 
`{
    lots(query: "${query}", pagination: "${pagination}") {
      ...LotType
    }
  }
  ${LOT_TYPE}
`

const IS_EXISTING_ORGANIZATION = (domain) => `{
    isExistingOrganization(domain: "${domain}") {
      exists
    }
  }
`

const ORGANIZATION = (domain, id) => `{
    organization(domain: "${domain}", id: "${id}") {
      ...OrgStub
    }
  }
  ${ORG_TYPE_STUB}
`

const ORGANIZATIONS = (query) => `{
    organizations(query: "${query}") {
      ...OrgStub
    }
  }
  ${ORG_TYPE_STUB}
`

const RETREIVE_STATE_ROLES = (state) => `{
    retrieveStateRoles(state: "${state}") {
      identifier
      label
    }
  }
`

const RETREIVE_STATE_PERMIT_FORM = (state) => `{
    retrieveStatePermitForm(state: "${state}") {
      url
    }
  }
`

const STATISTICS = `{
    statistics {
      ...StatisticsType
    }
  }
  ${STATISTICS_TYPE}
`

const REGULATORY_AGENCY = (state) => `{
    regulatorAgency(state: "${state}") {
      state
      departments {
        name
      }
      statistics {
        ...StatisticsType
      }
      organizations {
        ...OrgStub
      }
    }
  }
  ${STATISTICS_TYPE}
  ${ORG_TYPE_STUB}
`

const LOGIN = (user) => `{
    login(user: "${user}") {
      ...UserType
    }
  }
  ${USER_TYPE}
`

const ME = `{
    me {
      ...UserType
    }
  }
  ${USER_TYPE}
`

const REFRESH_TOKEN = (token, device) => `{
    refreshToken(token: "${token}", device: "${device}")
  }
`

const PRODUCT = (id) => `{
    product(id: "${id}") {
      ...ProductType
    }
  }
  ${PRODUCT_TYPE}
`

const PRODUCTS = (query) => `{
    products(query: "${query}") {
      ...ProductType
    }
  }
  ${PRODUCT_TYPE}
`

const PERMIT = (id) => `{
    permit(id: "${id}") {
      ...PermitType
    }
  }
  ${PERMIT_TYPE}
`

const PERMITS = (status) => `{
    permits(status: "${status}") {
      ...PermitType
    }
  }
  ${PERMIT_TYPE}
`

const GAS_PRICE = `{
    gasPrice {
      recommended
    }
  }
`


/* Query Controllers */
/* 
  Notes:
  - clean and validate query injections
  - apply any post-query processing
  - add query string and paginination params to Lots query
  - bring over docs from GraphiQL
  - removed admin
*/

const isExistingUser = async (email, callback) => {
  //clean and validate email
  const result = await fetchQuery(IS_EXISTING_USER(email))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const isExistingDevice = async (address, callback) => {
  //clean and validate address
  const result = await fetchQuery(IS_EXISTING_DEVICE(address))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const lots = async (query, pagination, callback) => {
  //clean and validate
  const result = await fetchQuery(LOTS(query, pagination))
  //post-query processing 

  if(!!callback) callback(result)
  return result
}

const allLots = async (callback) => {
  //clean and validate
  const result = await fetchQuery(ALL_LOTS)
  //post-query processing 

  if(!!callback) callback(result)
  return result
}

const lot = async (address, callback) => {
  //clean and validate address
  const result = await fetchQuery(LOT(address))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const isExistingOrganization = async (domain, callback) => {
  //clean and validate domain
  const result = await fetchQuery(IS_EXISTING_ORGANIZATION(domain))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const organization = async (domain, id, callback) => {
  //clean and validate domain, id
  const result = await fetchQuery(ORGANIZATION(domain, id))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const organizations = async (query, callback) => {
  //clean and validate query
  const result = await fetchQuery(ORGANIZATIONS(query))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const retrieveStateRoles = async (state, callback) => {
  //clean and validate state
  const result = await fetchQuery(RETREIVE_STATE_ROLES(state))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const retrieveStatePermitForm = async (state, callback) => {
  //clean and validate state
  const result = await fetchQuery(RETREIVE_STATE_PERMIT_FORM(state))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const statistics = async (callback) => {
  const result = await fetchQuery(STATISTICS)
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const regulatorAgency = async (state, callback) => {
  //clean and validate state
  const result = await fetchQuery(REGULATORY_AGENCY(state))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const login = async ({email, password}, callback) => {
  //clean and validate email, password
  const result = await fetchQuery(LOGIN({email, password}))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const me = async (callback) => {
  const result = await fetchQuery(ME)
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const refreshToken = async (token, {address, signature}, callback) => {
  //clean and validate things
  const result = await fetchQuery(REFRESH_TOKEN(token, {address, signature}))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const product = async (id, callback) => {
  //clean and validate id
  const result = await fetchQuery(PRODUCT(id))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const products = async (query, callback) => {
  //clean and validate query
  const result = await fetchQuery(PRODUCTS(query))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const permit = async (id, callback) => {
  //clean and validate id
  const result = await fetchQuery(PERMIT(id))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const permits = async (status, callback) => {
  //clean and validate status
  const result = await fetchQuery(PERMITS(status))
  //post-query processing

  if(!!callback) callback(result)
  return result
}

const gasPrice = async (callback) => {
  const result = await fetchQuery(GAS_PRICE)
  //post-query processing

  if(!!callback) callback(result)
  return result
}

export default {
  lotTypes,
  isExistingDevice,
  isExistingUser,
  lot,
  lots,
  allLots,
  isExistingOrganization,
  organization,
  organizations,
  retrieveStateRoles,
  retrieveStatePermitForm,
  statistics,
  regulatorAgency,
  login,
  me,
  refreshToken,
  product,
  products,
  permit,
  permits,
  gasPrice
}
