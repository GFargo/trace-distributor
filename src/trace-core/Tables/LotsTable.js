import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import SortableTable from './SortableTable/SortableTable'

const formatDateString = (dateString) => {
  let d = new Date(dateString);
  let month = `${d.getMonth() + 1}`.padStart(2,0);
  let day = `${d.getDay()}`.padStart(2,0);
  return `${day}-${month}-${d.getFullYear()}`
}

class LotsTable extends Component {
  constructor(props) {
    super(props);

    this.tableColumns = this.tableColumns.bind(this);
    this.filterFn = this.filterFn.bind(this);
    this.targetLink = this.targetLink.bind(this);
    this.tableFilters = this.tableFilters.bind(this);
  }

  targetLink(lot) {
    return(
      <Link to={"/"+(lot.parentLot === null ? "cultivating" : "processing")+"/"+lot.address}>
        <button type="button" className="custom-btn btn btn-outline-dark">More Info</button>
      </Link>)
    }

    tableFilters(){
      return([
        {
          name: 'organization',
          displayName: 'Organization',
          getValue: lot => (lot.organization ? lot.organization.name : "PLACEHOLDER")
        },
        {
          name: 'state',
          displayName: 'State',
          getValue: lot => (lot.state)
        },
        {
          name: 'verified',
          displayName: 'Verified',
          getValue: lot => (lot.verified ? "Yes" : "No")
        }
      ])
    }

    tableColumns() {
      return([
        {
          name: 'name',
          displayName: 'Name',
          displayValue: lot =>(<strong>{lot.name}</strong>),
          sortable: lot =>(lot.name)
        },
        {
          name: 'date',
          displayName: 'Date',
          displayValue: lot => (formatDateString(lot.created)),
          sortable: lot => (formatDateString(lot.created))
        },
        {
          name: 'organization',
          displayName: 'Organization',
          displayValue: lot =>(lot.organization ? lot.organization.name : "TODO FAKE"),
          sortable: lot =>(lot.organization ? lot.organization.name : "TODO FAKE")
        },
        {
          name: 'state',
          displayName: 'State',
          displayValue: lot =>(lot.state),
          sortable: lot =>(lot.state)
        },
        {
          name: 'verified',
          displayName: 'Verified',
          displayValue: lot =>(lot.verified ? <i className="fa fa-check verified-mark" aria-hidden="true"></i> : <i className="fa fa-check" aria-hidden="true"></i>),
          sortable: lot =>(lot.verified ? "yes" : "no")
        },
        {
          name: 'sublots',
          displayName: 'Sublots',
          displayValue: lot =>(lot.subLots.length),
          sortable: lot =>(lot.subLots.length)
        },
        {
          name: 'address',
          displayName: 'Blockchain Address',
          displayValue: lot =>( <Link to={"/"+ (lot.parentLot === null ? "cultivating" : "processing") +"/"+lot.address}>{lot.address.substr(0,20)+" …"}</Link>),
          sortable: lot =>( lot.address)
        }
      ])
    }

    filterFn(lot) {
      return lot.name + lot.state + lot.address
    }

    render() {
      return (
        <SortableTable
          columns={this.tableColumns()}
          filters={this.tableFilters()}
          data={this.props.data}
          defaultSort='name'
          filterFn={this.filterFn}
          filterPlaceholder='Filter by Lot name, state or blockchain address...'
          targetLink={this.targetLink}
          noSearch={this.props.noSearch||false}
          maxRows={this.props.maxRows||0}
          noFilter={this.props.noFilter||false}
          pagination={true}
          pageSize={10}
        />
      );
    }
  }

LotsTable.propTypes = {
  data: PropTypes.array,
  noSearch: PropTypes.bool,
  maxRows: PropTypes.number,
  noFilter: PropTypes.bool
}
  export default LotsTable;
