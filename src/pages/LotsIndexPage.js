import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, PageLoader } from '../core/src/components/Elements'
import SortableTable from '../core/src/components/SortableTable'
import { localizeDateFromString } from '../core/src/utils/date-time/utils'


const LotsIndex = ({ lotsCollection }) => {

  const [ lots, loading, error ] = lotsCollection;

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
      displayValue: (lot) => (!lot.parentLot) ? "cultivating" : "processing",
      sortable: (lot) => (!lot.parentLot) ? "cultivating" : "processing"
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
        displayValue: lot => (lot.address !== 'unverified' ? <i className="icon-check verified-mark" aria-hidden="true" /> : <i className="" aria-hidden="true" />),
        sortable: lot => (lot.address !== 'unverified' ? 'yes' : 'no'),
    },
    {
      name: 'address',
      displayName: 'Blockchain Address',
      displayValue: (lot) => lot.address === 'unverified' ? (
        <Link to={'/distributor/lot-form/'+lot.id}>
          unverified
        </Link>
      ) : (
        <Link to={"/" + (!lot.parentLot ? "cultivating" : "processing") + "/" + lot.address}>
          {lot.address.substr(0, 20) + " …"}
        </Link>
      ),
      sortable: (lot) => lot.address === 'unverified' ? lot.id : lot.address
    },
  ])

  const ErrorView = () => (
    <h3>{`Error Loading lots: ${error || ''}`}</h3>
  );

  return (
    <>
    <div className="row mb-2 -mt-4">
      <h3 className="text-xl font-bold text-left">
        Organization Lots
      </h3>
    </div>
    {(!lots && loading) ? <PageLoader /> : 
    (!lots || !!error) ? <ErrorView /> : 
    !!lots?.length ? (
      <SortableTable
        columns={tableColumns()}
        filters={tableFilters()}
        data={lots}
        defaultSort='name'
        filterFn={(lot) => lot.name + lot.state + lot.address}
        filterPlaceholder='Filter by Lot name, state or blockchain address...'
        targetLink={targetInfoLink}
        noSearch={false}
        maxRows={0}
        noFilter={false}
        keyFn={(lot) => lot.address}
        pagination={true}
        pageSize={10}
      />
    ) : false}
    </>
  )
}

LotsIndex.propTypes = {
  lotsCollection: PropTypes.array.isRequired,
}

export default LotsIndex
