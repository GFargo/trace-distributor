import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './SortableTable.css';
import SortableTableHeader from './SortableTableHeader';
import TableFilterInput from './TableFilterInput';
import PaginationButtons from './PaginationButtons';
import TableFilter from './TableFilter';

export default class SortableTable extends Component {
  constructor(props) {
    super(props);

    // map array of filters that look like this:
    // {
    //   name: 'filterKey',
    //   displayName: 'displayname for button',
    //   getValue: (lot) => {return(lot.filterKey)}
    // }
    // into an object keyed off name after injecting active: false
    // and value: ""
    let keyedFilters = {}
    if (props.filters) {
      for (var i=0; i < props.filters.length; i ++){
        let f = props.filters[i];
        f.active = false;
        f.value = ""
        keyedFilters[f.name] = f;
      }
    }

    this.state = {
      // data handling
      columns: props.columns,
      data: props.data, // preserve OG data
      filteredData: props.data,
      keyFn: props.keyFn,

      // column filters
      filters: keyedFilters,
      activeFilters: [],

      // text search
      searchStringFn: this.props.filterFn,
      searchValue: "",

      // sorting
      sortBy: props.defaultSort,
      sortOrder: (props.defaultSortOrder || 'asc'),

      // pagination
      pagination: (props.pagination || false),
      pageSize: (props.pageSize || -1),
      currentPage: 0
    };

    this.setSearchState = this.setSearchState.bind(this);
    this.applySearchInputFilter = this.applySearchInputFilter.bind(this);
    this.activateFilter = this.activateFilter.bind(this);
    this.deactivateFilter = this.deactivateFilter.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.sortDataBy = this.sortDataBy.bind(this);
    this.handlePaginationClick = this.handlePaginationClick.bind(this);
    this.renderData = this.renderData.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
  }


  // mutate the base data with active filters and whatever the
  // search input provided us
  applyAllFilters() {
    // start with the original data
    let data = this.state.data;

    // apply each of the active filters
    let fkeys = Object.keys(this.state.filters);
    for (var i=0; i < fkeys.length; i ++){
      let filter = this.state.filters[fkeys[i]]
      if (filter.active) {
        data = this.applyFilter(filter, data )
      }
    }

    // apply the search input filter, "" matches everything
    data = this.applySearchInputFilter(data)

    // sort by the rules set by the user or the default
    data = this.sortDataBy(data, this.state.sortBy, this.state.sortOrder)

    // reset pagination and set filteredData for rendering
    this.setState({currentPage: 0,filteredData: data})
  }


  setSearchState(value) {
    this.setState({searchValue: value}, () => {this.applyAllFilters()});
  }

  applySearchInputFilter(data){
    let query = this.state.searchValue;
    data = data.filter((obj) => {
      let matchString = this.state.searchStringFn(obj);

      // sanitize regex input
      query = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

      let re = new RegExp(query, 'i');

      return matchString.match(re) !== null
    })
    return data
  }

  applyFilter(filter, data) {
    data = data.filter((object) => {
      return filter.getValue(object) === filter.value
    })
    return data;
  }

  activateFilter(name, value){
    let filters = this.state.filters;
    filters[name].value = value
    filters[name].active = true
    this.setState({filters: filters}, () => {this.applyAllFilters()})
  }

  deactivateFilter(name){
    let filters = this.state.filters;
    filters[name].value = ""
    filters[name].active = false
    this.setState({filters: filters}, () => {this.applyAllFilters()})
  }

  handlePaginationClick(direction) {
    // the direction passed in is either -1 (left) or +1 (right),
    // combine this value with our current page and update that value.
    // being at the max or min of our page range will prevent the click within
    // the component so this should only be triggered if there is a valid page
    // in the direction specified.
    this.setState({currentPage: this.state.currentPage + direction})
  }

  handleSort(newSortState) {
    let by = newSortState.sortBy
    let order = newSortState.sortOrder || this.state.sortOrder
    let newOrderedData = this.sortDataBy(this.state.filteredData, by, order)

    newSortState.filteredData = newOrderedData

    this.setState(newSortState)
  }


  sortDataBy(data, by, order){
    let column = this.state.columns.filter((c) => c.name === by)[0]
    let compare = (a, b) =>  {
      if (column.sortable(a) < column.sortable(b))
      return -1;
      if (column.sortable(a) > column.sortable(b))
      return 1;
      return 0;
    }
    let sortedData = data.sort(compare);

    if (order === 'desc') {
      sortedData = sortedData.reverse()
    }

    return sortedData;
  }

  renderData() {
    if (this.props.maxRows > 0) {
      return(this.state.filteredData.slice(0, this.props.maxRows))
    } else if (this.state.pagination) {
      let minIndex = this.state.currentPage * this.state.pageSize;
      let maxIndex = (this.state.currentPage * this.state.pageSize) + this.state.pageSize;
      return(this.state.filteredData.slice(minIndex, maxIndex))
    } else {
      return(this.state.filteredData)
    }
  }

  render() {
    return (
      <div className='SortableTable container-fluid'>
        <div className='row justify-content-end'>
          <div className="col-12">
          { !this.props.noFilter && this.state.filters &&
            Object.keys(this.state.filters).map((filterkey) => {
              let filter = this.state.filters[filterkey];
              return(<TableFilter
                data={this.state.filteredData}
                onDeactivate={this.deactivateFilter}
                key={"filter-"+filter.name}
                name={filter.name}
                getValue={filter.getValue}
                displayName={filter.displayName}
                onClick={this.activateFilter}
                active={filter.active}
              />);
            })
          }
          { !this.props.noSearch &&
                <TableFilterInput
                  data={this.state.filteredData}
                  onApply={this.setSearchState}
                  placeholder={this.props.filterPlaceholder}
                />

            }
          </div>
        </div>
        {this.state.pagination && !this.props.maxRows && <PaginationButtons
            dataLength={this.state.filteredData.length}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onClick={this.handlePaginationClick}
        />}
      <table style={{width: '100%'}}>
      <thead>
      <tr>
      {
        this.state.columns.map((c) => {
          return(
              <SortableTableHeader
                key={c.name}
                displayName={c.displayName}
                onSort={this.handleSort}
                name={c.name}
                order={this.state.sortOrder}
                by={this.state.sortBy}
              />
            )
          })
        }
        <th></th>
        </tr>
        </thead>
        <tbody>
        {this.renderData().map((d) => {
          let key = this.state.keyFn ? this.state.keyFn(d) : d.address;
          return(
            <tr key={key}>
            {this.state.columns.map((c) => {
              return(
                <td key={d.address+c.name}>
                  {c.displayValue(d)}
                </td>
              )
            })}
            <td>{this.props.targetLink(d)}</td>
            </tr>
          );
        })}
        </tbody>
        </table>
        {this.state.pagination && !this.props.maxRows && <PaginationButtons
            dataLength={this.state.filteredData.length}
            pageSize={this.state.pageSize}
            currentPage={this.state.currentPage}
            onClick={this.handlePaginationClick}
        />}
        </div>
      );
    }
  }

SortableTable.propTypes = {
  filters: PropTypes.array,
  columns: PropTypes.array,
  data: PropTypes.array,
  keyFn: PropTypes.func,
  filterFn: PropTypes.func,
  maxRows: PropTypes.number,
  pageSize: PropTypes.number,
  targetLink: PropTypes.func,
  noFilter: PropTypes.bool,
  noSearch: PropTypes.bool,
  filterPlaceholder: PropTypes.string,
  defaultSortOrder: PropTypes.string,
  defaultSort: PropTypes.string,
  pagination: PropTypes.bool
}

SortableTable.defaultProps = {
  masxRows: 0
}
