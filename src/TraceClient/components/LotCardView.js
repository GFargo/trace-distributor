import React from 'react'
import { Card, Button, Icon } from 'antd'
import LotTitle from './LotTitle'
import LotStateDetailsView from './LotStateDetailsView'

export default ({lot, activeTabKey, onTabChange, onCloseLotView, onLotSelected}) => (
  <Card
    title={<> 
      <LotTitle lot={lot} /> 
      {!!lot?.parentLot && 
        <Button type="ghost" size="small" onClick={() => onLotSelected(lot.parentLot)}>
          <Icon type="left"/>{'Parent: '+lot.parentLot.name}
        </Button>}
      {!!lot?.subLots && !!lot?.subLots.length && lot.subLots.map((subLot) => (
        <Button key={subLot.address} type="ghost" size="small" onClick={() => onLotSelected(subLot)}>
          {'SubLot: '+subLot.name}<Icon type="right"/>
        </Button>
      ))}
    </>}
    extra={
      <Icon type="close" key="close" onClick={() => onCloseLotView()}/>
    }
    actions={[
      <Icon type="setting" key="setting" />,
      <Icon type="edit" key="edit" />,
      <Icon type="ellipsis" key="ellipsis" />
    ]}
    tabList={
      lot.details.map((each) => ({ key: each.state, tab: each.state }))
    }
    activeTabKey={activeTabKey}
    onTabChange={onTabChange}>
      <LotStateDetailsView 
        state={activeTabKey} 
        details={Object.entries(lot.details.find((detail) => detail.state === activeTabKey)?.data || {})} />
  </Card>
)