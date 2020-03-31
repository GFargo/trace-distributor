import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import { transformValues } from '../../../core/src/components/Lots/LotStateSection/LotSectionHelpers';
import Button from '../../../core/src/components/Elements/Button';
import ConfirmationModal from '../../../core/src/components/Elements/Modal/Confirmation'
import TextAreaInput from '../../../core/src/components/MultiForm/parts/TextAreaInput';


const LotDetailSelector = ({ lot, labelOverrides, onOverrideLabel, selection, onToggleSelection }) => {

  const [ overrideThisLabel, setOverrideModal ] = useState(null);

  const cultLot = !!lot?.parentLot ? lot.parentLot : lot;
  const lotRef = !!lot?.parentLot ? 'parentLot' : 'lot';

  const OverrideLabelModal = () => {
    const [ overrideValue, setOverrideValue ] = useState(
      !(overrideThisLabel?.name) ? '' : labelOverrides[overrideThisLabel.name] ? 
        labelOverrides[overrideThisLabel.name] : overrideThisLabel?.default || ''
    );

    return (
      <ConfirmationModal
        modal={{ isOpen: !!overrideThisLabel, setOpen: setOverrideModal }}
        titleText="Label Override"
        confirmFn={() => {
          if (overrideValue === overrideThisLabel.default) onOverrideLabel(overrideThisLabel.name, '');//reset to default
          else onOverrideLabel(overrideThisLabel.name, overrideValue);
          setOverrideModal(null);
        }}
        cancelFn={() => {
          setOverrideModal(null);
        }}
      >
        <TextAreaInput
          label="Lot Detail Label"
          name="detailLabel"
          invertColor={true}
          placeholder="Enter label override"
          value={overrideValue}
          error={""}
          className="w-100 hover:border-gray-500"
          updateValueAndError={(_, value) => setOverrideValue(value)}
        />
      </ConfirmationModal>

    );
  }

  const CheckboxListItem = ({ name, label, value }) => (
    <div className={"py-2"} >
      <div className="flex flex-row items-center">
        <input 
          type="checkbox" 
          className="w-auto mr-2"
          id={lot.address+name} 
          checked={!!selection[name]} 
          onChange={() => onToggleSelection(name, value)}
        />
        <label
          className={"custom-control-label " + (!selection[name] ? "text-gray-500" : "")}
          htmlFor={lot.address + name}
        >
          <strong className={((!!labelOverrides[name] && !!selection[name]) ? "text-gold-500" : (!!labelOverrides[name]) ? "text-gold-200" : "")}>
            {labelOverrides[name] ? labelOverrides[name]+':' : label+':'}
          </strong>
          &nbsp;{value}
        </label>
        <span className="" data-toggle="tooltip" data-placement="top" title="Override Label">
          <Button
            iconSize="base"
            icon="pencil"
            className="text-gold-500 hover:text-gold-900"
            color="transparent"
            onClickHandler={() => setOverrideModal({ name, default: label })}>
          </Button>
        </span>
      </div>
    </div>
  );

  CheckboxListItem.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }

  const SectionTitle = ({ title }) => (
    <div className={"row row-sm w-100 my-2"} >
      <h4 className="text-md font-bold text-gold-500">
        {title}
      </h4>
    </div>
  );

  SectionTitle.propTypes = {
    title: PropTypes.string.isRequired,
  }

  const getLotStateField = (lot, state, field) => {
    const details = !!lot.details && lot.details.find(one => one.state === state);
    const value = (!details || !details.data || !details.data[field]) ? null : details.data[field]
    return transformValues(field, value);
  }

  return (!lot) ? null : (
    <div className="my-2">
      <OverrideLabelModal />
      <SectionTitle title="CULTIVATION INFORMATION (ATTRIBUTES, GROW, HARVEST)" />
      {!!cultLot.name &&
        <CheckboxListItem
          name={`${lotRef}-lot-name`}
          label="Lot Name"
          value={cultLot.name}
        />}
      {!!cultLot.address &&
        <CheckboxListItem
          name={`${lotRef}-lot-address`}
          label="Blockchain Address"
          value={cultLot.address}
        />}
      {!!cultLot.organization?.name &&
        <CheckboxListItem
          name={`${lotRef}-org-name`}
          label="Organization Name"
          value={cultLot.organization.name}
        />}
      {!!getLotStateField(cultLot, 'initial', 'strain') &&
        <CheckboxListItem
          name={`${lotRef}-initial-strain`}
          label="Strain"
          value={getLotStateField(cultLot, 'initial', 'strain')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'cloned') &&
        <CheckboxListItem
          name={`${lotRef}-initial-cloned`}
          label="Seed Source"
          value={getLotStateField(cultLot, 'initial', 'cloned')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'growType') &&
        <CheckboxListItem
          name={`${lotRef}-initial-growType`}
          label="Grow Type"
          value={getLotStateField(cultLot, 'initial', 'growType')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'growMedium') &&
        <CheckboxListItem
          name={`${lotRef}-initial-growMedium`}
          label="Grow Medium"
          value={getLotStateField(cultLot, 'initial', 'growMedium')}
        />}
      {!!getLotStateField(cultLot, 'harvest', 'lastMaturityDate') &&
        <CheckboxListItem
          name={`${lotRef}-harvest-lastMaturityDate`}
          label="Harvest Date"
          value={getLotStateField(cultLot, 'harvest', 'lastMaturityDate')}
        />}
      {!!getLotStateField(cultLot, 'grow', 'notes') &&
        <CheckboxListItem
          name={`${lotRef}-grow-notes`}
          label="Farming Practice Notes"
          value={getLotStateField(cultLot, 'grow', 'notes')}
        />}
      {!!getLotStateField(cultLot, 'grow', 'nutrientCycle') &&
        <CheckboxListItem
          name={`${lotRef}-grow-nutrientCycle`}
          label="Nutrient Cycle Notes"
          value={getLotStateField(cultLot, 'grow', 'nutrientCycle')}
        />}
      {!!lot.parentLot &&
        <SectionTitle title="EXTRACTION INFORMATION" />}
      {!!lot.parentLot && !!lot.name &&
        <CheckboxListItem
          name="lot-lot-name"
          label="Lot Name"
          value={lot.name}
        />}
      {!!lot.parentLot && !!lot.address &&
        <CheckboxListItem
          name="lot-lot-address"
          label="Blockchain Address"
          value={lot.address}
        />}
      {!!lot.parentLot && !!lot.organization?.name &&
        <CheckboxListItem
          name="lot-org-name"
          label="Organization Name"
          value={lot.organization.name}
        />}
      {!!lot.parentLot && !!getLotStateField(lot, 'extracted', 'extractionType') &&
        <CheckboxListItem
          name="lot-extracted-extractionType"
          label="Extraction Type"
          value={getLotStateField(lot, 'extracted', 'extractionType')}
        />}
      {!!lot.parentLot && !!getLotStateField(lot, 'extracted', 'extractionDate') &&
        <CheckboxListItem
          name="lot-extracted-extractionDate"
          label="Extraction Date"
          value={getLotStateField(lot, 'extracted', 'extractionDate')}
        />}
    </div>
  )
}

LotDetailSelector.defaultProps = {
  lot: {
    address: '',
    name: '',
    parentLot: null,
    organization: {
      name: '',
    },
    details: [],
  },
}

LotDetailSelector.propTypes = {
  lot: PropTypes.shape({
    address: PropTypes.string,
    name: PropTypes.string,
    parentLot: PropTypes.shape({}),
    organization: PropTypes.shape({
      name: PropTypes.string,
    }),
    details: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired, 
  labelOverrides: PropTypes.shape({}).isRequired,
  onOverrideLabel: PropTypes.func.isRequired,
  selection: PropTypes.shape({}).isRequired, 
  onToggleSelection: PropTypes.func.isRequired,
}

export default LotDetailSelector;