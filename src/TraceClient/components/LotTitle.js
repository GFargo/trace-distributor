import React from 'react'
import { Badge, Statistic } from 'antd'

export default ({lot}) => (
  <> 
    <span style={{paddingRight: "8px"}}>
      {lot?.organization?.name+' - '+lot?.name+' ('+lot?.state+')'}
    </span> 
    <br />
    {lot?.totalSupply && 
    <Statistic style={{fontSize: "14px"}} prefix="Total Supply: " value={lot?.totalSupply} suffix={
      <>
      <span style={{paddingRight: "12px"}}>grams</span> 
      <Badge status={(lot?.forSale) ? "success" : "error"} text={(lot?.forSale) ? "for sale" : "not for sale"} />
      </>
    }/>}
  </>
)