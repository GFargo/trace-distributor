import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MultiForm from '../../core/src/components/MultiForm';
import unverifiedLot from '../../configs/multiform/unverifiedLot';
import { genLotID } from '../../services/traceFirebase';
import { inflateLot, deflateLot } from './utils';


class LotForm extends PureComponent {

  constructor(props) {
    super(props);
    const { populateFromID, lots } = props;
    const populateLot = (!!populateFromID) ? lots.find(lot => populateFromID === lot.id) : null;

    this.state = (!!populateLot) ? {
      id: populateLot.id,
      formData: deflateLot(populateLot),
    } : {
      id: genLotID(),
      formData: {},
    };

    //console.log('CONST populateLot: ', populateLot)
    //console.log('CONST STATE ', this.state)
  }

  render() {
    const { 
      lots, 
      handleSubmit,
      invertColor,
      errorMessage
    } = this.props;

    const {
      id,
      formData
    } = this.state;

    const isDisabled = (!formData || !formData['lot-lot-name'])
    //console.log('STATE ', this.state)
    //console.log('RENDER formData ', formData)
    //console.log('$$$$$$$$$$$LOT ', inflateLot(formData))

    return (
      <div>
        <MultiForm
          enableDebug
          onCloseRedirect="/distributor/lots"
          onUpdate={ data => this.setState({ ...this.state, formData: data })}
          onSubmit={ data => !!formData['lot-lot-name'] && handleSubmit({ id, ...inflateLot(data) }) }
          saveOnStepChange={true}
          formData={formData}
          sidebar={false}
          {...unverifiedLot}
        />
      </div>
    );
  }
}

LotForm.defaultProps = {
  populateFromID: '',
  invertColor: false,
  errorMessage: '',
};

LotForm.propTypes = {
  populateFromID: PropTypes.string,
  lots: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  invertColor: PropTypes.bool,
}

export default LotForm;
