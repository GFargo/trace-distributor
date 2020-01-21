
const testImg = require('./images/tom121.jpg')

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
    strainType: randomType(LotTypes.StrainType), 
    datePlanted: '2019-05-21', 
    location: '420 Dank Lane, Randolph, VT',
    cloned: randomBoolean(),
    growType: randomType(LotTypes.GrowType),
    growMedium: randomType(LotTypes.GrowMedium),
    seedOrCloneAmount: randomInt(500, 2000),
    images: [testImg]
  },
  grow: {
    minTemp: randomFloat(50, 60),
    maxTemp: randomFloat(80, 94),
    floweringDate: '2019-08-10',
    notes: 'Notes about growing.',
    minHumidity: 0.36,
    maxHumidity: 0.78,
    nutrientCycle: 'Notes about nutrient cycle.',
    images: [testImg]
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
    images: [testImg],
    dryingMethod: 'barn hang',
    productImage: testImg
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
    images: [testImg]
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
    terpeneContent: 11.1,
    microbialContent: 11.1,
    mycotoxin: 11.1,
    bacteria: 11.1,
    yeast: 11.1,
    mold: 11.1,
    ecoli: 11.1,
    salmonella: 11.1,
    pesticide: 11,
    moisture: 11.1,
    heavyMetals: 11.1,
    images: [testImg],
    productImage: testImg
  },
  product: {
    notes: 'Product transition notes.'
  },
  complete: {
    product: 'Production compeletion notes.'
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

const User = () => ({
  firstName: 'The',//String!, First name of user
  lastName: 'Dude',//String!, Last name of user
  organization: {/*TODO - recurse much? apply reference by id */},//Organization
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
  lots: [/*TODO - recurse much? apply reference by lot address */],//[Lot], Array of lots associated to organization
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
  subLots: [],//[/* TODO - apply reference by lot address*/],//[Lot], All sublots associated to Lot (parent)
  parentLot: null,//Lot, Parent lot info
  hasParent: false,//Boolean!, Simple boolean check if sublot has parent
  currentUserPermissions: randomType(LotTypes.UserPermType),//[LotPermission], Returns current users access
  url: '',//URI, The URL where the info is presented
  created: 1579040207 //DateTime, When created aka blockchain block timestamp
})

export default function mockLots() {
  let parentLots = ['Lotsa Hemp A', 'Lotsa Hemp B', 'Lotsa Hemp C', 'Lotsa Hemp D', 'Lotsa Hemp E'].map((name) => Lot(name, 'complete'))
  let subLots = ['Lotsa Oil A', 'Lotsa Oil B', 'Lotsa Oil C', 'Lotsa Oil D', 'Lotsa Oil E'].map((name) => Lot(name))
  subLots = subLots.map((lot, index) => ({...lot, parentLot: parentLots[index], hasParent: true}))
  parentLots = parentLots.map((lot, index) => ({...lot, subLots: [subLots[index]] }))
  return [...parentLots, ...subLots]
}