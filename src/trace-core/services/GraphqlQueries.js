export const loginQuery = (email, password) => {
   return(`{
    login(user: {password: "${password}", email: "${email}"}) {
      firstName
      lastName
      authToken
    }
  }`)
}

export const statsQuery = `{
  statistics {
    lots {
      state
      count
    }
  }
}`

export const fullLot = `{
  name
  address
  state
  hasParent
  totalSupply
  url
  created
  totalSupply
  organization { name address domain owner { firstName lastName } }
  nextPermitted { name address domain }
  parentLot { name address }
  subLots { name address created totalSupply state details { state } }
  details {
    state
    infoFileHash
    created
    creator { firstName lastName organization {name address} }
    data {
      ... on InitialData {
        strain
        strainType
        datePlanted
        location
        cloned
        growType
        growMedium
      }
      ... on GrowData {
        minTemp
        maxTemp
        floweringDate
        notes
        minHumidity
        maxHumidity
        nutrientCycle
      }
      ... on HarvestData {
        lastMaturityDate
        minTemp
        maxTemp
        minHumidity
        maxHumidity
        yield
      }
      ... on ExtractingData {
        extractionType
        mailingDate
        notes
      }
      ... on ExtractedData {
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
      }
      ... on TestingData {
        sampleSize
        sampleMailingDate
        notes
      }
      ... on TestedData {
        testType
        sampleType
        testDate
        sampleWeight
        cbdaProfile { percentage mass }
        thcaProfile { percentage mass }
        thcProfile { percentage mass }
        cbnProfile { percentage mass }
        potentialCBDProfile { percentage mass }
        potentialTHCProfile { percentage mass}
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
      }
      ... on ProductData {
        notes
      }
      ... on CompletedData {
        product
      }
    }
  }
}`

export const lotSummary = `{
  name
  address
  state
  hasParent
  totalSupply
  url
  created
  organization { name address domain }
  parentLot { name address }
  subLots { name address created totalSupply state details { state } }
 }`

export const allLotsSummary = `{
  lots(query: "") ${lotSummary}
}`

export const meQuery = `{me {firstName lastName email organization { domain }}}`

export const allOrganizationsSummary = `{
  organizations(query: "") {
    name
    infoHash
    address
    domain
    location { state }
    owner { firstName lastName }
    users { firstName lastName }
    verified
    lots ${lotSummary}
  }
}`

export const meOrganizationAll = `{
  me {
    organization
    {
      domain
    }
  }
}`

export const lotByAddressQuery = (address) => {
  return(`{
    lot(address: "${address}") ${fullLot}
  }`)
}
