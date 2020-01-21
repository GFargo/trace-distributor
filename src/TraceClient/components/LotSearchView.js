import React from 'react'
import { List, Select, Spin, Avatar } from 'antd'
import LotTitle from './LotTitle'

const weedImg = require('../images/weed.jpg')

export default ({lots, onLotSelected, filterValue, onFilterChange}) => (
  (!lots) ? (
    <Spin size="large" />
  ) : (
    <>
    <Select
      style={{width: "240px", padding: "16px", marginLeft: "31px"}}
      value={filterValue}
      onSearch={(value) => onFilterChange(value)}
      showSearch
      allowClear
      placeholder="Search Lots"
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={null}/>

    <List
      itemLayout="vertical"
      size="small"
      dataSource={lots}
      renderItem={(lot) => 
        <List.Item key={lot.address} onClick={() => onLotSelected(lot)}>
          <List.Item.Meta
            avatar={<Avatar src={weedImg} />}
            title={<LotTitle lot={lot} />}/>
        </List.Item>
      }/>
    </>
  )
)