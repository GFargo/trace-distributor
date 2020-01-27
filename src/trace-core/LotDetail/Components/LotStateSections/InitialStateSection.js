import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LotSectionKeys, transformValues } from '../../LotSectionHelpers'

export default class InitialStateSection extends Component {
  render() {
    return(
     <div className="LotSection">
       <div className="row">
        {Object.keys(this.props.data).map((key) => {
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
             } else {return(null)}
           })}
        </div>
     </div>
   )
  }
}

InitialStateSection.propTypes = {
  data: PropTypes.object,
  state: PropTypes.string
}
