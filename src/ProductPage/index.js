import React from 'react'
import PropTypes from 'prop-types'
import ProductView from './ProductView'
import getMockLots from './mockLotData'

export const ProductPage = ({ address }) => {
  const productLots = getMockLots()
  console.log("productLots >>>>> ", productLots)
  return (
    <ProductView productLots={productLots} />
  )
}

ProductPage.propTypes = {
  address: PropTypes.string.isRequired
}

export default ProductPage