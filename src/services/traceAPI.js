import 'whatwg-fetch'

//const DEV_SERVER_HOST = "https://trace-backend-dev.herokuapp.com"
const DEV_SERVER_HOST = "http://trace-backend-dev-pr-204.herokuapp.com"

const DEV_GRAPHQL_PATH = DEV_SERVER_HOST + "/graphql/"
const JSON_HEADER = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}
const JSON_AUTH_HEADER = (authToken) => ({
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer " + authToken
})

const fetchQuery = async (query, authToken = '') => {
  try {
    const response = await fetch(DEV_GRAPHQL_PATH, {
      method: "POST",
      headers: (!!authToken) ? JSON_AUTH_HEADER(authToken) : {...JSON_HEADER},
      body: JSON.stringify({query})
    })
    const result = await response.json()
    if (!!result?.errors?.length) {
      return { 
        error: result.errors[0].message, 
        errorMsg: result.errors[0].message 
      }
    } else { 
      return (!!result?.data) ? result.data : { 
        error: "Query returned null data." 
      } 
    }
  } catch (error) { return {error} }
}

/* GraphQL Type Fragments */

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
    created
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
const ORG_TYPE_STUB = `
  fragment OrgStub on Organization {
    name
    domain
    location {
      state
      address1
      address2
      zipcode
    }
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
      state
      totalSupply
      created
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

/* GraphQL Queries */

const allLotsQuery = `{
    lots {
      ...LotType
    }
  }
  ${LOT_TYPE}
`

const meOrgLotsQuery = `{
    me {
      organization {
        domain
        lots {
          ...LotType
        }
      }
    }
  }
  ${LOT_TYPE}
`

const loginQuery = (email, password) => {
   return(`{
    login(user: {password: "${password}", email: "${email}"}) {
      firstName
      lastName
      authToken
    }
  }`)
}

/* Query Controllers */

const receiveAllLots = async () => {
  //console.log('traceAPI >>> receiving All Lots... ')
  const result = await fetchQuery(allLotsQuery)

  /* TODO No access to org owner name - injecting temp data to prevent core component error  */
  const lots = !(!!result?.lots?.length) ? [] : 
    result.lots.filter((each) => !!each?.organization).map((lot) => ({
      ...lot, 
      organization: {
        ...lot.organization,
        owner: { firstName: 'NO ACCESS TO ORG OWNER NAME', lastName: 'TEST DATA' }
      }
    }))

  return lots
}

const receiveMeOrgLots = async (authToken) => {
  const result = await fetchQuery(meOrgLotsQuery, authToken)
  //console.log('traceAPI - receiveMeOrgLots result: ', result)
  let lots = (!!result.error) ? null : (!!result?.me?.organization?.lots) ? result.me.organization.lots : []

  /* TODO Failsafe data for testing - Remove after dev server setup */
  if (!!lots && !lots.length) {//empty lots, fill with test data
    const allLots = await receiveAllLots()
    lots = allLots.filter((lot) => lot?.organization?.domain === 'iostesthemp.com')
    console.log('traceAPI - receiveMeOrgLots test Lot empty, so POPULATING lots: ', lots)
  }
  return lots
}

export const loginUser = async (email, password, callback) => {
  //console.log('loginUser - creds: ', email, password)
  const user = {}
  const result = await fetchQuery(loginQuery(email, password))

  if (!result.login || !result.login.authToken || !!result.error) {
    user.authError = (!!result.errorMsg) ? result.errorMsg : "Email or Password Incorrect"
    console.error('traceAPI - loginUser auth error: ', (!!result.error) ? result.error : 'Uh oh! Unknown Error')
  
  } else { //valid auth
    user.username = (result.login.firstName || '')+' '+(result.login.lastName || '')
    user.authToken = result.login.authToken
    user.lots = await receiveMeOrgLots(result.login.authToken)

    //console.log('traceAPI - loginUser user: ', user)
  }
  
  if(!!callback) callback(user) 
  return user
}

export const receiveUserLots = async (authToken, callback) => {
  //console.log('traceAPI - receiveUserLots authToken: ', authToken)
  const lots = await receiveMeOrgLots(authToken)

  //console.log('traceAPI - receiveUserLots lots: ', lots)

  if(!!callback) callback(lots)
  return {lots}
}

const traceAPI = {
  loginUser,
  receiveUserLots,
}

export default traceAPI