import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LotSectionKeys, transformValues } from '../../LotSectionHelpers'

export default class ExtractStateSection extends Component {
  render() {
    let ExtractGrindingKeys = [
      "preMassGrinding",
      "postMassGrinding",
      "moisture",
      "nugTrimRatio"
    ]
    let hasExtractGrindingKeys = false;
    for (let i = 0; i < ExtractGrindingKeys.length; i ++) {
      hasExtractGrindingKeys = hasExtractGrindingKeys || Boolean(this.props.data[ExtractGrindingKeys[i]])
    }

    let ExtractTypeInputKeys = [
      "extractionType",
      "extractionDate",
      "bioBotanicalsMass",
      "extractorsMaterialsMass",
      "raffinateMass",
      "COIRaffinate"
    ]
    let hasExtractTypeInputKeys = false;
    for (let i = 0; i < ExtractTypeInputKeys.length; i ++) {
      hasExtractTypeInputKeys = hasExtractTypeInputKeys || Boolean(this.props.data[ExtractTypeInputKeys[i]])
    }

    let AdditionalExtractionKeys = [
      "additionalExtraction",
      "preAdditionalExtractionMass",
      "postAdditionalExtractionMass",
      "postAdditionalExtractionCOIPercentage"
    ]
    let hasAdditionalExtractionKeys = false;
    for (let i = 0; i < AdditionalExtractionKeys.length; i ++) {
      hasAdditionalExtractionKeys = hasAdditionalExtractionKeys || Boolean(this.props.data[AdditionalExtractionKeys[i]])
    }

    let ExtractCalculationKeys = [
      "oilMass",
      "solventVolume",
      "postWinterizationOilMass",
      "totalCOIPercentage"
    ]
    let hasExtractCalculationKeys = false;
    for (let i = 0; i < ExtractCalculationKeys.length; i ++) {
      hasExtractCalculationKeys = hasExtractCalculationKeys || Boolean(this.props.data[ExtractCalculationKeys[i]])
    }

    let TerpeneKeys = [
      "addedTerpenesDescription",
      "terpeneVolume",
      "terpeneWeight"
    ]
    let hasTerpeneKeys = false;
    for (let i = 0; i < TerpeneKeys.length; i ++) {
      hasTerpeneKeys = hasTerpeneKeys || Boolean(this.props.data[TerpeneKeys[i]])
    }

    return(
      <div className="LotSection">
          <h5>Grinding</h5>
          {hasExtractGrindingKeys && <React.Fragment>
            <div className="row">
              {ExtractGrindingKeys.map((key) => {
                  if (this.props.data[key]) {
                    return(
                      <div key={this.props.state + key} className="col-md-4">
                        <span className="LotDetailName">
                          {LotSectionKeys(key)}:&nbsp;
                        </span>
                        <span className="LotDetailValue">
                          {transformValues(key, this.props.data[key])}
                        </span>
                      </div>
                    )
                  } else {return("")}
              })}
            </div>
          </React.Fragment>}


          <h5>Type / Inputs</h5>
          {hasExtractTypeInputKeys && <React.Fragment>
            <div className="row">
              {ExtractTypeInputKeys.map((key) => {
                if (this.props.data[key]) {
                  return(
                    <div key={this.props.state + key} className="col-md-4">
                      <span className="LotDetailName">
                        {LotSectionKeys(key)}:&nbsp;
                      </span>
                      <span className="LotDetailValue">
                        {transformValues(key, this.props.data[key])}
                      </span>
                    </div>
                  )
                } else {return("")}
              })}
            </div>
          </React.Fragment>}


          { this.props.data["notes"] &&
            <div className="row note-wrapper">
              <div className="col-2">
                 <strong>Notes:</strong>
              </div>
              <div className="col-10">
                 {this.props.data.notes}
              </div>
            </div>
          }

          {hasExtractCalculationKeys && <React.Fragment>
            <h5>Calculations</h5>
            <div className="row">
            {ExtractCalculationKeys.map((key) => {
              if (this.props.data[key]) {
                return(
                  <div key={this.props.state + key} className="col-md-4">
                    <span className="LotDetailName">
                      {LotSectionKeys(key)}:&nbsp;
                    </span>
                    <span className="LotDetailValue">
                      {transformValues(key, this.props.data[key])}
                    </span>
                  </div>
                )
              } else {return("")}
            })}
            </div>
          </React.Fragment>}


          {hasAdditionalExtractionKeys && <React.Fragment>
            <h5>Additional Extraction</h5>
            <div className="row">
            {AdditionalExtractionKeys.map((key) => {
              if (this.props.data[key]) {
                return(
                  <div key={this.props.state + key} className="col-md-4">
                    <span className="LotDetailName">
                      {LotSectionKeys(key)}:&nbsp;
                    </span>
                    <span className="LotDetailValue">
                      {transformValues(key, this.props.data[key])}
                    </span>
                  </div>
                )
              } else {return("")}
            })}
            </div>
          </React.Fragment>}


          {hasTerpeneKeys && <React.Fragment>
            <h5>Terpenes</h5>
            <div className="row">
            {TerpeneKeys.map((key) => {
              if (this.props.data[key]) {
                return(
                  <div key={this.props.state + key} className="col-md-4">
                    <span className="LotDetailName">
                      {LotSectionKeys(key)}:&nbsp;
                    </span>
                    <span className="LotDetailValue">
                      {transformValues(key, this.props.data[key])}
                    </span>
                  </div>
                )
              } else {return("")}
            })}
            </div>
          </React.Fragment>}
      </div>
    )
  }
}

ExtractStateSection.propTypes = {
  data: PropTypes.object,
  state: PropTypes.string
}
