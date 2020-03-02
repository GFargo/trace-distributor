const PLACEHOLDER_IMAGE = 'https://exchange.tracevt.com/wp-content/uploads/2020/01/IMG_2414-2-scaled.jpg';

const randomType = types => types[Math.floor(Math.random() * types.length)];
const randomInt = (base, range) => Math.floor(Math.random() * range + base);
const randomFloat = (base, range) => (Math.random() * range + base).toFixed(2);
const randomBoolean = () => Math.random() < 0.5;

export const LotTypes = {
  LotState: [
    'new',
    'initial',
    'grow',
    'harvest',
    'extracting',
    'extracted',
    'testing',
    'tested',
    'product',
    'complete',
  ],
  StrainType: ['sativa', 'indica', 'hybrid'],
  GrowType: ['indoor', 'outdoor', 'greenhouse'],
  GrowMedium: ['soil', 'hydroponic'],
  ExtractType: [
    'bho',
    'pho',
    'bhopho',
    'super-critical-co2',
    'sub-critical-co2',
    'rso',
    'rosin',
    'tincture',
    'fractional-distillate',
    'water-hash',
    'dry-sift',
    'dry-ice-hash',
    'ethanol',
  ],
  WinterType: [
    'decarboxylation',
    'fractional-distillate',
    'super-crticial-fluid',
    'chromatography',
    'rotary-evaporation',
  ],
  SampleType: ['flower', 'oil'],
  ProfileType: ['ND', 'LOQ', 'NT'],
  UserPermType: ['read', 'write', 'transfer'],
};

const LotStateData = {
  new: {},
  initial: {
    strain: 'Supertrooper Kush',
    strainType: 'hemp',
    datePlanted: '2019-05-21',
    location: '123 Green Lane, Randolph, VT',
    cloned: randomBoolean(),
    growType: randomType(LotTypes.GrowType),
    growMedium: randomType(LotTypes.GrowMedium),
    seedOrCloneAmount: randomInt(500, 2000),
    images: [PLACEHOLDER_IMAGE],
  },
  grow: {
    minTemp: randomFloat(50, 60),
    maxTemp: randomFloat(80, 94),
    floweringDate: '2019-08-10',
    notes:
      'Notes about growing. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    minHumidity: 0.36,
    maxHumidity: 0.78,
    nutrientCycle:
      'Notes about nutrient cycle. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: [PLACEHOLDER_IMAGE],
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
    images: [PLACEHOLDER_IMAGE],
    dryingMethod: 'barn hang',
    productImage: PLACEHOLDER_IMAGE,
  },
  extracting: {
    extractionType: randomType(LotTypes.ExtractType),
    mailingDate: '2019-11-12',
    notes: 'Notes about extracting.',
  },
  extracted: {
    preGrindingMass: 8754.2,
    postGrindingMass: 8454.2,
    grindingMoisture: 0.24,
    nugTrimRatio: [85, 15],
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
    images: [PLACEHOLDER_IMAGE],
  },
  testing: {
    sampleSize: 100.0,
    sampleMailingDate: '2019-12-16',
    notes: 'Sample details.',
  },
  tested: {
    testType: 'test type tbd',
    sampleType: randomType(LotTypes.SampleType),
    testDate: '2019-12-21',
    sampleWeight: 100.0,
    cbdaProfile: { percentage: 20.2, mass: 200 },
    thcaProfile: { percentage: 1.2, mass: 20 },
    thcProfile: { percentage: 1.2, mass: 20 },
    cbnProfile: randomType(LotTypes.ProfileType),
    potentialCBDProfile: { percentage: 20.2, mass: 200 },
    potentialTHCProfile: { percentage: 1.2, mass: 20 },
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
    images: [PLACEHOLDER_IMAGE],
    productImage: PLACEHOLDER_IMAGE,
  },
  product: {
    notes: 'Product transition notes.',
  },
  complete: {
    product: {},
  },
};

const LotStateDetails = state => ({
  state,
  infoFileHash: 'QmT9qk3CRYbFDWpDFYeAv8T8H1gnongwKhh5J68NLkLir6',
  data: { ...LotStateData[state] },
  created: 1579040207,
});

const MockLot = (name, address, parentAddress) => ({
  name: !parentAddress ? `Parent Lot ${name}` : `Sublot ${name}`,
  address,
  totalSupply: randomInt(500, 200000),
  organization: {
    name: `Mock Company ${name}`,
    domain: 'dank.com',
    location: {
      address1: '123 Green Lane, Randolph',
      state: 'VT',
      zipcode: '010101',
    },
  },
  state: !parentAddress ? 'harvest' : 'complete',
  stateDetails: !parentAddress
    ? LotStateDetails('harvest')
    : LotStateDetails('complete'),
  details: !parentAddress
    ? ['initial', 'grow', 'harvest', 'product', 'complete'].map(state => LotStateDetails(state))
    : [
      'extracting',
      'extracted',
      'testing',
      'tested',
      'product',
      'complete',
    ].map(state => LotStateDetails(state)),
  forSale: true,
  parentLot: !parentAddress ? null : MockLot(name, parentAddress),
  hasParent: !!parentAddress,
  created: 'November 5, 2019',
});

const MockProduct = (name, lots) => ({
  owner: 'brian@tracevt.com',
  title: name,
  image: { url: PLACEHOLDER_IMAGE },
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  company: {
    name: 'Minnesota Hemp Company',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    logo: { url: PLACEHOLDER_IMAGE, hash: '' },
    location: { state: 'Minnesota', country: 'USA' },
  },
  created: 'February 25, 2020',
  packagingDate: 'February 22, 2020',
  certs: ['ORGANIC', 'KOSHER', 'NONGMO', 'ADSCA'],
  lots,
});

export const mockParentLotAddresses = [
  '0x0084Dfd7202E5F5C0C8Be83503a492837ca3E95E',
  '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
];

export const mockProductLotAddresses = [
  '0x22Cb9826B15148c88b4F53B13d91a1187A157f69',
  '0x03599A2429871E6be1B154Fb9c24691F9D301865',
];

export const getMockLotAddresses = () => [...mockProductLotAddresses];
export const getStaticProductData = () => {
  const product = MockProduct('Awesome Hemp Product', [
    MockLot('A', mockProductLotAddresses[0], mockParentLotAddresses[0]),
    MockLot('B', mockProductLotAddresses[1], mockParentLotAddresses[1]),
  ])
  return product
}

export default getStaticProductData;
