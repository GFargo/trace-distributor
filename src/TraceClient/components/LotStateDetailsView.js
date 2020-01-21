import React from 'react'
import { Descriptions } from 'antd'

export default ({state, details}) => (
  <Descriptions size="small" column={{xs: 1, sm: 1, md: 2, lg: 3, xl: 4}} bordered>
    {details.map((detail) => <Descriptions.Item key={detail[0]} label={detail[0]}>
      {(detail[1] === null) ? '' :
      (Array.isArray(detail[1])) ? detail[1].join(' ') :
      (typeof detail[1] === 'object') ? detail[1].percentage+' / '+ detail[1].mass : detail[1]}
    </Descriptions.Item>)}
  </Descriptions>
)