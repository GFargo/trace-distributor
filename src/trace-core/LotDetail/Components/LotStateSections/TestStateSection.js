import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { LotSectionKeys, transformValues } from '../../LotSectionHelpers'

export default class TestStateSection extends Component {
  render() {
    let TestInformationkeys = [
      "testType",
      "sampleType",
      "productImage",
      "testDate",
      "sampleWeight"
    ]
    let hasTestInformationkeys = false;
    for (let i = 0; i < TestInformationkeys.length; i ++) {
      hasTestInformationkeys = hasTestInformationkeys || Boolean(this.props.data[TestInformationkeys[i]])
    }

    let CannabanoidKeys = [
      "cbdaProfile",
      "cbdProfile",
      "thcaProfile",
      "thcProfile",
      "cbnProfile"
    ]
    let hasCannabanoidKeys = false;
    for (let i = 0; i < CannabanoidKeys.length; i ++) {
      hasCannabanoidKeys = hasCannabanoidKeys || Boolean(this.props.data[CannabanoidKeys[i]])
    }

    let ContaminantsProfileKeys = [
      "terpeneContent",
      "microbialContent",
      "mycotoxin",
      "bacteria",
      "yeast",
      "mold",
      "ecoli",
      "salmonella",
      "pesticide",
      "heavyMetals"
    ]
    let hasContaminantsProfileKeys = false;
    for (let i = 0; i < ContaminantsProfileKeys.length; i ++) {
      hasContaminantsProfileKeys = hasContaminantsProfileKeys || Boolean(this.props.data[ContaminantsProfileKeys[i]])
    }

    return(
      <div className="LotSection">

        {hasCannabanoidKeys && <React.Fragment>
           <h5>Test Information</h5>
           <div className="row">
           {TestInformationkeys.map((key) => {
             if (this.props.data[key] && key !== "productImage") {
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
             } else { return("") }
           })}
           </div>
         </React.Fragment>}

         { this.props.data["productImage"] &&
           <div className="row product-image">
             <div className="col-5">
                <strong>Product Image</strong>
                <img alt="product" src={this.props.data["productImage"]} />
             </div>
           </div>  }

         {hasCannabanoidKeys && <React.Fragment>
             <h5>Cannabanoid Profile</h5>
             <div className="row">
             {CannabanoidKeys.map((key) => {
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

         {hasContaminantsProfileKeys && <React.Fragment>
             <h5>Contaminants Profile</h5>
             <div className="row">
             {ContaminantsProfileKeys.map((key) => {
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

TestStateSection.propTypes = {
  data: PropTypes.object,
  state: PropTypes.string
}
