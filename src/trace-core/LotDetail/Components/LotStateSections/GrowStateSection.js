import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LotSectionKeys, transformValues } from '../../LotSectionHelpers'

export default class GrowStateSection extends Component {
  render() {
    return(
      <div className="LotSection">
          <div className="row">
          {Object.keys(this.props.data).map((key) => {
            if (this.props.data[key] && key !== "notes" && key !== "nutrientCycle") {
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
            } else {
              return("")
            }
          })}
          </div>
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
          { this.props.data["nutrientCycle"] &&
            <div className="row">
              <div className="col-2">
                 <strong>Nutrient Cycle:</strong>
              </div>
              <div className="col-10">
                 {this.props.data.nutrientCycle}
              </div>
            </div>
          }
      </div>
   )
  }
}

GrowStateSection.propTypes = {
  data: PropTypes.object,
  state: PropTypes.string
}
