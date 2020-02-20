import React from 'react'
import PropTypes from 'prop-types'
import { LotSectionKeys, transformValues } from '../core/src/components/Lots/LotStateSection/LotSectionHelpers'
import Button from '../core/src/components/Elements/Button'

const LOT_ENTRIES = [ 'name', 'address', 'totalSupply', 'created' ]
const ORG_ENTRIES = [ 'name', 'domain', 'location' ]

const transformStateValue = (state) => (
  (state === 'new') ? 'New' :
  (state === 'initial') ? 'Initial State' :
  (state === 'grow') ? 'Grow State' :
  (state === 'harvest') ? 'Harvest State' :
  (state === 'testing') ? 'Testing State' :
  (state === 'tested') ? 'Tested State' :
  (state === 'extracting') ? 'Extracting State' :
  (state === 'extracted') ? 'Extracted State' :
  (state === 'product') ? 'Product State' :
  (state === 'complete') ? 'Complete State' : ''
)

const CheckboxListItem = ({ id, label, isChecked, isMeta, onChange, indent }) => (
  <li className={"list-group-item d-flex justify-content-between align-items-center w-75 py-2 pl-"+indent} >
    <div className="custom-control custom-checkbox">
      <input 
        type="checkbox" 
        className="custom-control-input glyphicon-plus-sign" 
        id={id} 
        checked={isChecked} 
        onChange={onChange}
      />
      <label className={"custom-control-label "+(isChecked ? (isMeta ? "text-primary" : "text-body") : "text-muted")} htmlFor={id}>
        {label}
      </label>
    </div>
  </li>
)

const SelectionItems = ({ lots, selection, onToggleSelection }) => {
  const SelectionItems = []
  if (!!lots?.length) {
    lots.forEach((lot) => { 
      if (!!selection[lot.address]) {
        SelectionItems.push(
          <CheckboxListItem 
            key={lot.address} 
            id={lot.address}
            label={lot.name}
            indent={4}
            isChecked={selection[lot.address]}
            isMeta={true}
            onChange={() => onToggleSelection({address: lot.address})}
          />
        )
        SelectionItems.push(
          <CheckboxListItem 
            key={lot.address+'-lot'}
            id={lot.address+'-lot'}
            label={'Lot Information'}
            indent={12}
            isChecked={selection[lot.address+'-lot']}
            isMeta={true}
            onChange={() => onToggleSelection({address: lot.address, cat: 'lot'})}
          />
        )
        if (!!selection[lot.address+'-lot']) {
          LOT_ENTRIES.forEach((entry) => { 
            const key = lot.address+'-lot-'+entry
            const value = !!entry && transformValues(entry, lot[entry])
            if (!!value) {
              SelectionItems.push(
                <CheckboxListItem 
                  key={key} 
                  id={key}
                  label={LotSectionKeys(entry)+': '+value}
                  indent={20}
                  isChecked={selection[key]}
                  isMeta={false}
                  onChange={() => onToggleSelection({address: lot.address, cat: 'lot', entry, value })}
                />
              )
            }
          })
        }
        SelectionItems.push(
          <CheckboxListItem 
            key={lot.address+'-org'}
            id={lot.address+'-org'}
            label={'Organization'}
            indent={12}
            isChecked={selection[lot.address+'-org']}
            isMeta={true}
            onChange={() => onToggleSelection({address: lot.address, cat: 'org'})}
          />
        )
        if (!!selection[lot.address+'-org']) {
          ORG_ENTRIES.forEach((entry) => { 
            const key = lot.address+'-org-'+entry
            const value = !!entry && transformValues(entry, lot.organization[entry])
            if (!!value) {
              SelectionItems.push(
                <CheckboxListItem 
                  key={key} 
                  id={key}
                  label={LotSectionKeys(entry)+': '+value}
                  indent={20}
                  isChecked={selection[key]}
                  isMeta={false}
                  onChange={() => onToggleSelection({address: lot.address, cat: 'org', entry, value })}
                />
              )
            }
          })
        }
        lot.details.forEach((lotState) => {
          SelectionItems.push(
            <CheckboxListItem 
              key={lot.address+'-'+lotState.state}
              id={lot.address+'-'+lotState.state}
              label={transformStateValue(lotState.state)}
              indent={12}
              isChecked={selection[lot.address+'-'+lotState.state]}
              isMeta={true}
              onChange={() => onToggleSelection({address: lot.address, cat: lotState.state})}
            />
          )
          if (!!selection[lot.address] && !!selection[lot.address+'-'+lotState.state]) {
            Object.keys(lotState.data).forEach((entry) => {
              const key = lot.address+'-'+lotState.state+'-'+entry
              const value = !!entry && transformValues(entry, lotState.data[entry])
              if (!!value) {
                SelectionItems.push(
                  <CheckboxListItem 
                    key={key} 
                    id={key} 
                    label={LotSectionKeys(entry)+': '+value}       
                    indent={20}
                    isChecked={selection[key]}          
                    isMeta={false}
                    onChange={() => onToggleSelection({address: lot.address, cat: lotState.state, entry, value })}
                  />
                )
              } 
            })
          }
        })
      }
    })
  }
  return SelectionItems
}

const ManifestView = ({ lots, selection, onToggleSelection, onExportLotDataSelection }) => (
  <div className="container">
    <div className="row row-sm p-4 mt-2 ml-3">
      <p className="h5">Create Bill of Goods</p>
      {!!Object.keys(selection).filter((each) => !!selection[each] && each.split('-').length === 3).length && (
        <Button 
          type="button"
          color="green"
          className="ml-6"
          onClickHandler={onExportLotDataSelection}
        >
          Create
        </Button>
      )}
      <Button 
        type="link"
        color="gold"
        className="ml-6"
        to={'/product-page/3'}
      >
        Mock Product Page
      </Button>
    </div>
    <ul className="list-group">
      <SelectionItems lots={lots} selection={selection} onToggleSelection={onToggleSelection} />
    </ul>
  </div>
)

ManifestView.propTypes = {
  lots: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  onExportLotDataSelection: PropTypes.func.isRequired
}

export default ManifestView