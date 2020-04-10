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
      infoFileHash: !!populateLot.infoFileHash ? populateLot.infoFileHash : null,
      formData: deflateLot(populateLot),
    } : {
      id: genLotID(),
      formData: {},
    };

    //console.log('CONSTR populateLot: ', populateLot)
    //console.log('CONSTR STATE ', this.state)
  }

  render() {
    const { handleSubmit } = this.props;
    const { id, infoFileHash, formData } = this.state;
    const isDisabled = (!formData || !formData['lot-lot-name'])
    //console.log('RENDER STATE ', this.state)
    //console.log('RENDER LOT ', inflateLot(formData))

    return (
      <div>
        <MultiForm
          onCloseRedirect="/distributor/lots"
          onUpdate={ data => this.setState({ ...this.state, formData: data })}
          onSubmit={ () => { !isDisabled && handleSubmit({ id, infoFileHash, ...inflateLot(formData) }) }}
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
