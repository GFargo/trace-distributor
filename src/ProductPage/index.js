import React from 'react'
import ProductView from './ProductView'
import getMockProductLotData from './mockLotData'

export const ProductPage = ({ address }) => {
  const product = getMockProductLotData('oil')
  console.log("ProductView >>>>> ", product)
  return (
    <ProductView product={product} />
  )
}

export default ProductPage