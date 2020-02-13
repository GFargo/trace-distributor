
const placeholderImage = 'https://exchange.tracevt.com/wp-content/uploads/2020/01/IMG_2414-2-scaled.jpg'

const randomType = (types) => types[Math.floor(Math.random() * types.length)];
const randomInt = (base, range) => Math.floor(Math.random() * range + base);
const randomFloat = (base, range) => (Math.random() * range + base).toFixed(2);
const randomBoolean = () => (Math.random() < 0.5) ? true : false;

export const LotTypes = {
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

const fillLotStateHistory = (lotState) => {
  const history = []
  if (!lotState || lotState === 'new' || !LotTypes.LotState.includes(lotState)) return history
  let state = lotState
  while (state !== 'new') {
    history.push(LotStateDetails(state))
    if (state === 'initial') state = 'new'
    else if (state === 'grow') state = 'initial'
    else if (state === 'harvest') state = 'grow'
    else if (state === 'extracting') state = 'harvest'
    else if (state === 'extracted') state = 'extracting'
    else if (state === 'testing') state = 'extracted'
    else if (state === 'tested') state = 'testing'
    else if (state === 'product') state = 'tested'
    else if (state === 'complete') state = 'product'
    else state = 'new'
  }
  return history
}

const LotStateData = {
  new: {},
  initial: {
    strain: 'SuperTrooper Kush',
    strainType: 'hemp', 
    datePlanted: '2019-05-21', 
    location: '420 Dank Lane, Randolph, VT',
    cloned: randomBoolean(),
    growType: randomType(LotTypes.GrowType),
    growMedium: randomType(LotTypes.GrowMedium),
    seedOrCloneAmount: randomInt(500, 2000),
    images: [placeholderImage]
  },
  grow: {
    minTemp: randomFloat(50, 60),
    maxTemp: randomFloat(80, 94),
    floweringDate: '2019-08-10',
    notes: 'Notes about growing. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    minHumidity: 0.36,
    maxHumidity: 0.78,
    nutrientCycle: 'Notes about nutrient cycle. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: [placeholderImage]
  },
  harvest: {
    lastMaturityDate: '2019-11-03',
    minTemp: randomFloat(50, 60),
    maxTemp: randomFloat(80, 94),
    firstDateDrying: '2019-11-03',
    lastDateDrying: '2019-11-11',
    minHumidity: 0.42,
    maxHumidity: 0.84,
    averageHumidity: 0.66,
    averageTemperature: 78.8,
    yield: 18754.2,
    images: [placeholderImage],
    dryingMethod: 'barn hang',
    productImage: placeholderImage
  },
  extracting : {
    extractionType: randomType(LotTypes.ExtractType),
    mailingDate: '2019-11-12',
    notes: 'Notes about extracting.'
  },
  extracted: {
    preGrindingMass: 8754.2,
    postGrindingMass: 8454.2,
    grindingMoisture: 0.24,
    nugTrimRatio: [85,15],
    extractionType: randomType(LotTypes.ExtractType),
    extractionDate: '2019-11-13',
    preExtractionMass: 8414.2,
    postExtractionMass: 7314.2,
    wasteMaterialMass: 5414.2,
    extractionEfficiency: 0.845,
    notes: 'Notes about extraction.',
    preWinterizationMass: 1111.1,
    postWinterizationMass: 999.9,
    solventVolume: 444.4,
    winterizationEfficiency: 0.885,
    additionalExtraction: randomType(LotTypes.WinterType),
    preAdditionalExtractionMass: 999.9,
    postAdditionalExtractionMass: 999.9,
    additionalExtractionEfficiency: 1.0,
    addedTerpenesDescription: 'Added terpenes details.',
    terpenesVolume: 11.1,
    terpenesWeight: 10.1,
    images: [placeholderImage]
  },
  testing: {
    sampleSize: 100.0,
    sampleMailingDate: '2019-12-16',
    notes: 'Sample details.'
  },
  tested: {
    testType: 'test type tbd',
    sampleType: randomType(LotTypes.SampleType),
    testDate: '2019-12-21',
    sampleWeight: 100.0,
    cbdaProfile: { percentage: 20.20, mass: 200 },
    thcaProfile: { percentage: 1.20, mass: 20 },
    thcProfile: { percentage: 1.20, mass: 20 },
    cbnProfile: randomType(LotTypes.ProfileType),
    potentialCBDProfile: { percentage: 20.20, mass: 200 },
    potentialTHCProfile: { percentage: 1.20, mass: 20 },
    terpeneContent: 1.1,
    microbialContent: 5.1,
    mycotoxin: 1.1,
    bacteria: 3.1,
    yeast: 5.1,
    mold: 3.1,
    ecoli: 0.1,
    salmonella: 7.1,
    pesticide: 2,
    moisture: 2.1,
    heavyMetals: 3.1,
    images: [placeholderImage],
    productImage: placeholderImage
  },
  product: {
    notes: 'Product transition notes.'
  },
  complete: {
    product: {

    }
  }
}

const LotStateDetails = (state) => ({
  state,
  infoFileHash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6', 
  data: { ...LotStateData[state] },
  created: 1579040207,
  creator: {
    firstName: 'Andy',
    lastName: 'Anderson',
    organization: 'Mind Kontrol Inc',
    role: 'owner',
    authToken: ''
  }
})
/*
const User = () => ({
  firstName: 'The',//String!, First name of user
  lastName: 'Dude',//String!, Last name of user
  organization: {
  role: 'owner',//String
  authToken: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6'//String!
})

const Device = () => ({
  name: 'MobileDude',//String
  address: '0x3fe6a3B093487462e90AEBDb5680e06D1990D602',//AccountAddress!
  owner: User()//User
})

const Organization = () => ({
  id: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',//ID!
  name: 'Mind Kontrol Inc',//String!, Name of organization
  infoHash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',//String, IPFS info hash for off chain stored data
  address: '0x3fe6a3B093487462e90AEBDb5680e06D1990D602',//AccountAddress, Address of organization on blockchain
  owner: User(),//User!, Owner of organization
  domain: 'mindkontrol.com',//Domain!, Domain associated with organization
  location: '420 Dank Lane, Randolph, VT',//Location, Location of organization
  roles: [{//[OrganizationRole], Organization roles
    identifier: 'owner',
    label: 'owner'
  }],
  verified: true,//Boolean, If Organization has been verified by Trace
  lots: [
  users: [//[User]
    User()
  ],
  devices: [//[Device]
    Device()
  ],
  deviceAccessRequests: [//[Device]
    Device()
  ],
  lotFactory: {//LotFactory
    address: '0x3fe6a3B093487462e90AEBDb5680e06D1990D602',
    version: '1.0'
  },
  permit: {//PermitInfo
    photoID: '',//URI!
    licenseNumber: '223452345',//String!
    permitHolderName: 'The Dude'//String!
  },
  statistics: {//OrganizationStatistics
    lots: [{//[LotStateCount]
      state: randomType(LotTypes.LotState),
      count: 1//Int
    }],
    users: 1,//Int
    devices: 1//Int
  }
})

const Lot = (name, state = randomType(LotTypes.LotState)) => ({
  infoFileHash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
  name,//String! Name of lot
  address: randomInt(111111111, 999999999),//Lot contract address
  organization: Organization(),
  nextPermitted: Organization(),//Next permitted organization to persist state
  state,//LotState!, State of the lot in string
  stateDetails: LotStateDetails(state),//LotStateDetails, current state details of lot
  details: fillLotStateHistory(state),//[LotStateDetails], all state details of lot
  totalSupply: randomFloat(500, 2000),//Float, Total supply
  forSale: randomBoolean(),//Boolean
  factory: {//LotFactory
    address: '0x3fe6a3B093487462e90AEBDb5680e06D1990D602',
    version: '1.0'
  },
  subLots: [],//[
  parentLot: null,//Lot, Parent lot info
  hasParent: false,//Boolean!, Simple boolean check if sublot has parent
  currentUserPermissions: randomType(LotTypes.UserPermType),//[LotPermission], Returns current users access
  url: '',//URI, The URL where the info is presented
  created: 1579040207, //DateTime, When created aka blockchain block timestamp
  image: placeholderImage
})

const SelectionLot = (name, state) => ({
  name,//String! Name of lot
  address: '0x3fe6a3B093487462e90AEBDb5680e06D1990D602',//Lot contract address
  totalSupply: randomInt(500, 10000),//Float, Total supply
  organization:{
    name: 'Mind Kontrol Inc',
    domain: 'mindkontrol.com',
    location: { address1: '420 Dank Lane, Randolph', state: 'VT', zipcode: '010101' }
  },
  state,//LotState!, State of the lot in string
  states: {...LotStateData},
  subLots: [],//[
  parentLot: null,//Lot, Parent lot info
  hasParent: true,//Boolean!, Simple boolean check if sublot has parent
  created: 1579040207 //DateTime, When created aka blockchain block timestamp
})

export mockLots = () => {
  let parentLots = ['Lotsa Hemp A', 'Lotsa Hemp B', 'Lotsa Hemp C', 'Lotsa Hemp D', 'Lotsa Hemp E'].map((name) => Lot(name, 'complete'))
  let subLots = ['Lotsa Oil A', 'Lotsa Oil B', 'Lotsa Oil C', 'Lotsa Oil D', 'Lotsa Oil E'].map((name) => Lot(name))
  subLots = subLots.map((lot, index) => ({...lot, parentLot: parentLots[index], hasParent: true}))
  parentLots = parentLots.map((lot, index) => ({...lot, subLots: [subLots[index]] }))
  return [...parentLots, ...subLots]
}

export mockLotSelections = () => {
  let parentLot = SelectionLot('Lotsa Hemp', 'harvest')
  const subLots = ['Lotsa Oil A', 'Lotsa Oil B'].map((name) => ({
    ...SelectionLot(name, 'complete'), 
    parentLot: parentLot, 
    hasParent: true
  }))
  parentLot = {...parentLot, subLots }
  return [...subLots, parentLot]
}
*/

const MockCultivatingLot = () => ({
  name: 'Mock Hemp Lot',
  address: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
  totalSupply: 423456,
  organization: {
    name: 'Mock Hemp Company',
    domain: 'dank.com',
    location: { address1: '420 Mock Lane, Randolph', state: 'VT', zipcode: '010101' }
  },
  state: 'harvest',
  stateDetails: LotStateDetails('harvest'),
  details: ['initial', 'grow', 'harvest'].map((state) => LotStateDetails(state)),
  forSale: true,
  parentLot: null,
  hasParent: false,
  subLots: [],
  created: '2019-4-20'
})

const MockProcessingLot = () => ({
  name: 'Mock Oil Lot',
  address: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
  totalSupply: 5858,
  organization: {
    name: 'Mock Hemp Company',
    domain: 'dank.com',
    location: { address1: '420 Mock Lane, Randolph', state: 'VT', zipcode: '010101' }
  },
  state: 'complete',
  stateDetails: LotStateDetails('tested'),
  details:  ['extracting', 'extracted', 'testing', 'tested', 'product', 'complete'].map((state) => LotStateDetails(state)),
  forSale: true,
  parentLot: MockCultivatingLot(),
  hasParent: true,
  subLots: [],
  created: '2019-4-20'
})

const MockProductLot = () => ({
  name: 'Mock Soap Lot',
  address: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
  totalSupply: 2200,
  organization: {
    name: 'Mock Hemp Company',
    domain: 'dank.com',
    location: { address1: '420 Mock Lane, Randolph', state: 'VT', zipcode: '010101' }
  },
  state: 'complete',
  stateDetails: LotStateDetails('product'),
  details:  ['extracting', 'extracted', 'testing', 'tested', 'product', 'complete'].map((state) => LotStateDetails(state)),
  forSale: true,
  parentLot: MockProcessingLot(),
  hasParent: true,
  subLots: [],
  created: '2019-4-20'
})

const MockHempProduct = () => ({
  id: 11111,
  title: 'Mock Hemp Product',
  supplyLot: MockCultivatingLot(),
  image: { url: placeholderImage },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  company: {
    name: 'Mock Hemp Company',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    logo: { url: placeholderImage, hash: '' },
    location: { state: 'Minnesota', country: 'USA' }
  },
  created: '2019-4-20',
  dnaReportUrl: 'What is this?'
})

const MockOilProduct = () => ({
  id: 22222,
  title: 'Mock Oil Product',
  supplyLot: MockProcessingLot(),
  image: { url: placeholderImage },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  company: {
    name: 'Mock Hemp Company',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    logo: { url: placeholderImage, hash: '' },
    location: { state: 'Minnesota', country: 'USA' }
  },
  created: '2019-4-20',
  dnaReportUrl: 'What is this?'
})

const MockSoapProduct = () => ({
  id: 22222,
  title: 'Mock Soap Product',
  supplyLot: MockProductLot(),
  image: { url: placeholderImage },
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  company: {
    name: 'Mock Hemp Company',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    logo: { url: placeholderImage, hash: '' },
    location: { state: 'Minnesota', country: 'USA' }
  },
  created: '2019-4-20',
  dnaReportUrl: 'What is this?'
})

export const getMockProductLotData = (type) => 
  (type === 'hemp') ? MockHempProduct() : (type === 'oil') ? MockOilProduct() : MockSoapProduct()

export default getMockProductLotData