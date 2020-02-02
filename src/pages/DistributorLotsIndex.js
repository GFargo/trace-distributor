import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Button from '../core/src/components/Elements/Button'
import SortableTable from '../core/src/components/SortableTable'
import { localizeDateFromString } from '../core/src/utils/date-time/utils'


const LotsIndex = ({ lots }) => {

  const targetInfoLink = (lot) => (
    <Button color="black" variant="outline" to={"/" + (!lot.parentLot ? "cultivating" : "processing") + "/" + lot.address}>
      More Info
    </Button>
  )

  const tableFilters = () => ([
    {
      name: 'type',
      displayName: 'Type',
      getValue: (lot) => (lot.parentLot === null) ? "cultivating" : "processing",
      size: 'base'
    },
    {
      name: 'state',
      displayName: 'State',
      getValue: (lot) => lot.state,
      size: 'base'
    },
    {
      name: 'verified',
      displayName: 'Verified',
      getValue: (lot) => (lot.verified) ? "Yes" : "No",
      size: 'base'
    }
  ])

  const tableColumns = () => ([
    {
      name: 'name',
      displayName: 'Name',
      displayValue: (lot) => (<strong>{lot.name}</strong>),
      sortable: (lot) => lot.name
    },
    {
      name: 'date',
      displayName: 'Date',
      displayValue: (lot) => localizeDateFromString(lot.created),
      sortable: (lot) => localizeDateFromString(lot.created)
    },
    {
      name: 'type',
      displayName: 'Type',
      displayValue: (lot) => (lot.parentLot === null) ? "cultivating" : "processing",
      sortable: (lot) => (lot.parentLot === null) ? "cultivating" : "processing"
    },
    {
      name: 'state',
      displayName: 'State',
      displayValue: (lot) => lot.state,
      sortable: (lot) => lot.state
    },
    {
      name: 'verified',
      displayName: 'Verified',
      displayValue: (lot) => (lot.verified) ? 
        (<i className="icon-check verified-mark" aria-hidden="true"></i>) : 
          (<i className="icon-check" aria-hidden="true"></i>),
      sortable: (lot) => (lot.verified) ? "yes" : "no"
    },
    {
      name: 'sublots',
      displayName: 'Sublots',
      displayValue: (lot) => lot.subLots.length,
      sortable: (lot) => lot.subLots.length
    },
    {
      name: 'address',
      displayName: 'Blockchain Address',
      displayValue: (lot) => (
        <Link to={"/" + (!lot.parentLot ? "cultivating" : "processing") + "/" + lot.address}>
          {lot.address.substr(0, 20) + " …"}
        </Link>),
      sortable: (lot) => lot.address
    }
  ])

  return (
    <SortableTable
      columns={tableColumns()}
      filters={tableFilters()}
      data={lots || []}
      defaultSort='name'
      filterFn={(lot) => !!lot && lot.name + lot.state + lot.address}
      filterPlaceholder='Filter by Lot name, state or blockchain address...'
      targetLink={targetInfoLink}
      noSearch={false}
      maxRows={0}
      noFilter={false}
      keyFn={(lot) => !!lot && lot.address}
      pagination={true}
      pageSize={10}
    />
  )
}

LotsIndex.propTypes = {
  lots: PropTypes.array
}

export default LotsIndex