import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LotSectionKeys, transformValues } from '../../LotSectionHelpers'

export default class GenericLotSection extends Component {
  // note that ` '' + transformValues() ` is used  below here in case we
  // get a new State type with unexpected keys returning objects like the
  // test result objects
  render() {
    return(
      <div className="LotSection">
         {Object.keys(this.props.data).map((key) => {
           if (this.props.data[key]) {
             return(
               <div key={this.props.state + key} className="col-md-4">
                  <span className="LotDetailName">
                    {LotSectionKeys(key)}:&nbsp;
                  </span>
                  <span className="LotDetailValue">
                    {'' + transformValues(key, this.props.data[key])}
                  </span>
               </div>
             )
           } else {return("")}

          })}
      </div>
   )
  }
}

GenericLotSection.propTypes = {
  data: PropTypes.object,
  state: PropTypes.string
}
