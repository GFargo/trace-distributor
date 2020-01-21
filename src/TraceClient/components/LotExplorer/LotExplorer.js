import React, { Component } from 'react'
import LotCardView from '../LotCardView'
import LotSearchView from '../LotSearchView'
import traceAPI from '../../TraceAPI'
import mockLots from '../../MockLotData.js'


const createLotDir = (lots) => {
  const lotDir = {};
  if (!!lots && !!lots.length) 
    lots.forEach((lot) => { if (!!lot?.address) lotDir[lot.address] = lot })
  return lotDir
}

const filterLotsByName = (lots, filter) => lots.filter((lot) => (filter.length < 3) ? 
  lot.name.trim().toLowerCase().startsWith(filter.trim().toLowerCase()) : 
    lot.name.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) >= 0)

export default class LotExplorer extends Component {
  state = {
    allLots: undefined,// all lots cached
    lots: undefined,// current viewable lots
    lotDir: undefined,// lot directory by address
    lot: undefined,// current selected lot
    filterType: 'name',//current filter type
    filterValue: '',//current filter value
    tab: ''//current selected tab
  }

  refreshLots = () => traceAPI.allLots(({ lots }) => this.setState({ lots, allLots: lots, lotDir: createLotDir(lots) })) 

  useMockLots = (lots = mockLots()) => this.setState({ lots, allLots: lots, lotDir: createLotDir(lots) })

  cachedLot = (address) => this.state.lotDir[address]

  persistData = () => localStorage.setItem('trace-cache', JSON.stringify({ lots: this.state.allLots, timestamp: Date.now() }))

  componentDidMount() {
    const { mock } = this.props 

    if (!mock) {
      const cached = JSON.parse(localStorage.getItem('trace-cache') || {lots: []})
      if (!!cached && !!cached.lots) this.setState({ lots: cached.lots, allLots: cached.lots, lotDir: createLotDir(cached.lots) }) 
      this.refreshLots()
      window.addEventListener("unload", this.persistData)
    } else this.useMockLots()
  }

  componentWillUnmount() {
    const { mock } = this.props

    if (!mock) {
      window.removeEventListener("unload", this.persistData)
      this.persistData()  
    }
  }

  render() { //console.log(this.state)
    const { lots, allLots, lot, tab, filterValue } = this.state
    
    return (
      <div style={{padding: "12px"}}>
        {(!!lot) ? (
          <LotCardView 
            lot={lot}
            activeTabKey={tab}
            onTabChange={(key) => this.setState({ tab: key })}
            onCloseLotView={() => this.setState({ lot: undefined })}
            onLotSelected={(lot, selected = this.cachedLot(lot.address)) => this.setState({ lot: selected, tab: selected.state })}/>
        ) : (
          <LotSearchView 
            lots={lots}
            filterValue={filterValue}
            onFilterChange={(value) => this.setState({ filterValue: value, lots: 
              (!value || !value.trim().length) ? allLots : filterLotsByName(allLots, value)})}
            onLotSelected={(lot) => this.setState({ lot: this.cachedLot(lot.address), tab: lot.state })}/>
        )}
      </div>
    )
  }
}