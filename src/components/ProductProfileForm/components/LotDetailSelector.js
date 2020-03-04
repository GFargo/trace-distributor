import React from 'react';
import PropTypes from 'prop-types';
import { transformValues } from '../../../core/src/components/Lots/LotStateSection/LotSectionHelpers';

const LotDetailSelector = ({ lot, selection, onToggleSelection }) => {
  const cultLot = !!lot?.parentLot ? lot.parentLot : lot;
  const lotRef = !!lot?.parentLot ? 'parentLot' : 'lot';

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
          className={"custom-control-label " + (!!selection[name] ? "text-body" : "text-muted")}
          htmlFor={lot.address + name}
        >
          <strong>{label}</strong>
          &nbsp;{value}
        </label>
      </div>
    </div>
  );

  const SectionTitle = ({ title }) => (
    <div className={"row row-sm w-100 my-2"} >
      <h4 className="text-md font-bold text-gold-500">
        {title}
      </h4>
    </div>
  );

  const getLotStateField = (lot, state, field) => {
    const cat = !!lot.details && lot.details.find(one => one.state === state);
    const value = (!cat || !cat.data || !cat.data[field]) ? null : cat.data[field]
    return transformValues(field, value);
  }

  return (!lot) ? null : (
    <div className="my-2">
      <SectionTitle title="CULTIVATION INFORMATION (ATTRIBUTES, GROW, HARVEST)" />
      {!!cultLot.name &&
        <CheckboxListItem
          name={`${lotRef}-lot-name`}
          label="Lot Name:"
          value={cultLot.name}
        />}
      {!!cultLot.address &&
        <CheckboxListItem
          name={`${lotRef}-lot-address`}
          label="Blockchain Address:"
          value={cultLot.address}
        />}
      {!!cultLot.organization?.name &&
        <CheckboxListItem
          name={`${lotRef}-org-name`}
          label="Organization Name:"
          value={cultLot.organization.name}
        />}
      {!!getLotStateField(cultLot, 'initial', 'strain') &&
        <CheckboxListItem
          name={`${lotRef}-initial-strain`}
          label="Genetics:"
          value={getLotStateField(cultLot, 'initial', 'strain')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'growType') &&
        <CheckboxListItem
          name={`${lotRef}-initial-growType`}
          label="Grow Type:"
          value={getLotStateField(cultLot, 'initial', 'growType')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'growMedium') &&
        <CheckboxListItem
          name={`${lotRef}-initial-growMedium`}
          label="Grow Medium:"
          value={getLotStateField(cultLot, 'initial', 'growMedium')}
        />}
      {!!getLotStateField(cultLot, 'harvest', 'lastMaturityDate') &&
        <CheckboxListItem
          name={`${lotRef}-initial-lastMaturityDate`}
          label="Harvest Date:"
          value={getLotStateField(cultLot, 'harvest', 'lastMaturityDate')}
        />}
      {!!getLotStateField(cultLot, 'initial', 'cloned') &&
        <CheckboxListItem
          name={`${lotRef}-initial-cloned`}
          label="Seed Source:"
          value={getLotStateField(cultLot, 'initial', 'cloned')}
        />}
      {!!getLotStateField(cultLot, 'grow', 'notes') &&
        <CheckboxListItem
          name={`${lotRef}-grow-notes`}
          label="Farming Practice Notes:"
          value={getLotStateField(cultLot, 'grow', 'notes')}
        />}
      {!!getLotStateField(cultLot, 'grow', 'nutrientCycle') &&
        <CheckboxListItem
          name={`${lotRef}-grow-nutrientCycle`}
          label="Nutrient Cycle Notes:"
          value={getLotStateField(cultLot, 'grow', 'nutrientCycle')}
        />}
      {!!lot.parentLot &&
        <SectionTitle title="EXTRACTION INFORMATION" />}
      {!!lot.parentLot && !!lot.name &&
        <CheckboxListItem
          name="lot-lot-name"
          label="Lot Name:"
          value={lot.name}
        />}
      {!!lot.parentLot && !!lot.address &&
        <CheckboxListItem
          name="lot-lot-address"
          label="Blockchain Address:"
          value={lot.address}
        />}
      {!!lot.parentLot && !!lot.organization?.name &&
        <CheckboxListItem
          name="lot-org-name"
          label="Organization Name:"
          value={lot.organization.name}
        />}
      {!!lot.parentLot && !!getLotStateField(lot, 'extracted', 'extractionType') &&
        <CheckboxListItem
          name="lot-extracted-extractionType"
          label="Extraction Type:"
          value={getLotStateField(lot, 'extracted', 'extractionType')}
        />}
      {!!lot.parentLot && !!getLotStateField(lot, 'extracted', 'extractionDate') &&
        <CheckboxListItem
          name="lot-extracted-extractionDate"
          label="Extraction Date:"
          value={getLotStateField(lot, 'extracted', 'extractionDate')}
        />}
    </div>
  )
}

LotDetailSelector.propTypes = {
  lot: PropTypes.shape({}).isRequired, 
  selection: PropTypes.shape({}).isRequired, 
  onToggleSelection: PropTypes.func.isRequired,
}

export default LotDetailSelector;