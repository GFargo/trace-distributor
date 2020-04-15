import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MultiForm from '../../core/src/components/MultiForm';
import unverifiedLot from '../../configs/multiform/unverifiedLot';
import { genLotID } from '../../services/traceFirebase';
import { inflateLot, deflateLot } from './utils';


class LotForm extends PureComponent {

  constructor(props) {
    super(props);
    const { populateFromLot } = props;
    this.state = (!!populateFromLot) ? {
      id: populateFromLot.id,
      infoFileHash: !!populateFromLot.infoFileHash ? populateFromLot.infoFileHash : null,
      prevInfoFileHash: !!populateFromLot.prevInfoFileHash ? populateFromLot.prevInfoFileHash : null,
      created: !!populateFromLot.created ? populateFromLot.created : null,
      owner: !!populateFromLot.owner ? populateFromLot.owner : null,
      formData: deflateLot(populateFromLot),
    } : {
      id: genLotID(),
      formData: {},
    };

    //console.log('CONSTR populateLot: ', populateLot)
    //console.log('CONSTR STATE ', this.state)
  }

  submitLot = () => { 
    const { handleSubmit } = this.props;
    const { id, infoFileHash, prevInfoFileHash, created, owner, formData } = this.state;
    if (!formData || !formData['lot-lot-name']) return;

    handleSubmit({ 
      ...inflateLot(formData),
      id, 
      infoFileHash,
      prevInfoFileHash,
      created,
      owner,
      address: 'unverified',
      state: 'harvest',
    });

    this.setState({ ...this.state, formData: {} });//clear data
  }

  render() {
    const { formData } = this.state;
    
    console.log('RENDER STATE ', this.state)
    console.log('RENDER LOT ', inflateLot(formData))

    return (
      <div>
        <MultiForm
          onCloseRedirect="/distributor/lots"
          onUpdate={data => this.setState({ ...this.state, formData: data })}
          onSubmit={this.submitLot}
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
  invertColor: false,
  errorMessage: '',
};

LotForm.propTypes = {
  populateFromLot: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.bool,
  ]).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  invertColor: PropTypes.bool,
}

export default LotForm;
