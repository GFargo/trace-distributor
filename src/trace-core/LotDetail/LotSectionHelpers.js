export const formatDateString = (dateString) => {
  let d = new Date(dateString);
  // + 1 to month b/c jan == 0
  let month = `${d.getMonth() + 1}`.padStart(2,0);

  let day = `${d.getDay()}`.padStart(2,0);
  return `${day}-${month}-${d.getFullYear()}`
}

export const extractionTypes = (key) => {
  let dict = {
    "bho": "BHO",
    "pho": "PHO",
    "bhopho": "BHO/PHO",
    "superCriticalCO2": "Super Critical CO2",
    "superCriticalFluidChromatography": "Super Critical Fluid Chromatography",
    "rso": "RSO",
    "rosin": "Rosin",
    "tincture": "Tincture",
    "fractionalDistillate": "Fractional Distillate",
    "terpenes": "Terpenes",
    "drySift": "Dry Sift",
    "dryIceHash": "Dry Ice Hash",
    "ethanol": "Ethanol"
  }
  return(dict[key] || key);
}

export const testTypes = (key) => {
  let dict = {
    "contaminants": "Contaminants",
    "chemicalPotency": "Chemical Potency",
    "contaminantsAndChemicalPotency": "Contaminants And Chemical Potency"
  }
  return(dict[key] || key);
}

export const LotSectionKeys = (key) => {
  let dict = {
    // Initial state keys
    "strain":      "Strain",
    "strainType":  "Strain Type",
    "datePlanted": "Date Planted",
    "location":    "Grow Location",
    "cloned":      "Clone / Seed",
    "growType":    "Grow Type",
    "growMedium":  "Grow Medium",

    // Growing keys
    "minTemp":       "Min. Temperature",
    "maxTemp":       "Max Temperature",
    "floweringDate": "Flowering Date",
    "notes":         "Notes",
    "minHumidity":   "Min. Humidity",
    "maxHumidity":   "Max Humidity",
    "nutrientCycle": "Nutrient Cycle",

    // Harvest keys
    "lastMaturityDate": "Last Maturity Date",
    "firstCuringDate":  "First Curing Date",
    "lastCuringDate":   "Last Curing Date",
    "yield":            "Yield",

    // Extract keys
    "preGrindingMass":                       "Pre Grinding Mass",
    "postGrindingMass":                      "Post Grinding Mass",
    "moisture":                              "Moisture",
    "extractionType":                        "Extraction Type",
    "bioBotanicalsMass":                     "Bio Botanical Mass",
    "extractorsMaterialsMass":               "Extractor Materials Mass",
    "nugTrimRatio":                          "Nug:Stem Trim Ratio",
    "extractionDate":                        "Extraction Date",
    "raffinateMass":                         "Raffinate Mass",
    "COIRaffinate":                          "COI percentage of Raffinate",
    "oilMass":                               "Oil Mass",
    "solventVolume":                         "Solvent Volume",
    "postWinterizationOilMass":              "Post Winterization Oil Mass",
    "totalCOIPercentage":                    "Oil COI Percent",
    "additionalExtraction":                  "Additional Extraction",
    "preAdditionalExtractionMass":           "Pre Additional Extraction Mass",
    "postAdditionalExtractionMass":          "Post Additional Extraction Mass",
    "postAdditionalExtractionCOIPercentage": "COI Percentage",
    "addedTerpenesDescription":              "Terpenes Description",
    "terpeneVolume":                         "Terpene Volume",
    "terpeneWeight":                         "Terpene Weight",

    // Test Keys
    "mailingDate":      "Mailing Date",
    "testType":         "Test Type",
    "sampleType":       "Sample Type",
    "sampleSize":       "Sample Size",
    "sampleMailingDate": "Sample Mailing Date",
    "productImage":     "Product Image",
    "testDate":         "Test Date",
    "sampleWeight":     "Sample Weight",
    "cbdaProfile":      "CBDa Profile",
    "cbdProfile":       "CBD Profile",
    "thcaProfile":      "THCa Profile",
    "thcProfile":       "THC Profile",
    "cbnProfile":       "CBN Profile",
    "terpeneContent":   "Terpene Content",
    "microbialContent": "Microbial Content",
    "mycotoxin":        "Mycotoxin",
    "bacteria":         "Bacteria",
    "yeast":            "Yeast",
    "mold":             "Mold",
    "ecoli":            "Ecoli",
    "salmonella":       "Salmonella",
    "pesticide":        "Pesticide",
    "heavyMetals":      "Heavy Metals"
  };

  return(dict[key] || key);
}

// ` '' + transformValues() ` is used  below here in case we
// get a new State type with unexpected keys returning objects like the
// test result objects
export const transformValues = (key, value) => {
  switch (key) {
    case "cloned":
      return(value ? "Clone" : "Seed");

    // stuff that is in grams
    case "raffinateMass":
    case "preMassGrinding":
    case "postMassGrinding":
    case "bioBotanicalsMass":
    case "extractorsMaterialsMass":
    case "oilMass":
    case "postWinterizationOilMass":
    case "preAdditionalExtractionMass":
    case "postAdditionalExtractionMass":
    case "terpeneWeight":
    case "yield":
    case "sampleWeight":
      return(value + "g");

    case "extractionType":
      return(extractionTypes(value))

    case "testType":
      return(testTypes(value))

    // Test profile objects {"percentage": "20.20", "mass": "200"}
    case "cbdaProfile":
    case "cbdProfile":
    case "thcaProfile":
    case "thcProfile":
    case "cbnProfile":
      return(value["percentage"] + "% / " + value["mass"] + "g");

    // ml volumes
    case "terpeneVolume":
    case "solventVolume":
      return(value + "ml");

    // temps
    case "minTemp":
    case "maxTemp":
      return(value + String.fromCharCode(176));

   case "floweringDate":
   case "datePlanted":
   case "lastMaturityDate":
   case "firstCuringDate":
   case "lastCuringDate":
   case "extractionDate":
   case "sampleMailingDate":
   case "mailingDate":
   case "testDate":
     return(formatDateString(value));

    // percentages
    case "terpeneContent":
    case "microbialContent":
    case "mycotoxin":
    case "bacteria":
    case "yeast":
    case "mold":
    case "ecoli":
    case "salmonella":
    case "COIRaffinate":
    case "moisture":
    case "pesticide":
    case "minHumidity":
    case "totalCOIPercentage":
    case "postAdditionalExtractionCOIPercentage":
    case "heavyMetals":
    case "maxHumidity":
      return(value + "%");

    case "nugTrimRatio":
      return(value[0] + ":" + value[1])

    default:
      return(value);
  }
}
