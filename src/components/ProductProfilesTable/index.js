import React from 'react';
import PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import SortableTable from '../../core/src/components/SortableTable'
import Pending from '../../core/src/components/Elements/Loader'
import { localizeDateFromString } from '../../core/src/utils/date-time/utils'
import { useProducts } from '../../services/traceFirebase';


const ProductProfilesTable = ({ email }) => {
  const [products, loading, error] = useProducts(email); 
  //console.log('ProductList, products: ', products);

  const tableColumns = () => ([
    {
      name: 'title',
      displayName: 'Product Name',
      displayValue: (product) => (<strong>{product.title}</strong>),
      sortable: (product) => product.title
    },
    {
      name: 'date',
      displayName: 'Profile Date',
      displayValue: (product) => localizeDateFromString(new Date(product.created)),
      sortable: (product) => localizeDateFromString(new Date(product.created))
    },
    {
      name: 'address',
      displayName: 'Blockchain Address',
      displayValue: (product) => (
        <Link to={"/processing/"+product.productLot}>
          {product.productLot.substr(0, 20) + " …"}
        </Link>),
      sortable: (product) => product.productLot
    },
    {
      name: 'page',
      displayName: 'Profile Page',
      displayValue: (product) => (
        !!product?.url && (
          <span>
            <a className="mr-4 cursor-hand" target="_blank" rel="noopener noreferrer" href={product.url}>
              View
            </a>
            <a className="cursor-hand" target="_blank" rel="noopener noreferrer" href={product.url}>
              Edit
            </a>
          </span>
        )
      ),
      sortable: () => false,
    },
    {
      name: 'qrcode',
      displayName: 'QR Code',
      displayValue: (product) => (
        !!product?.qrcode?.url && (
          <span>
            <a className="mr-4 cursor-hand" target="_blank" rel="noopener noreferrer" href={product.qrcode.url}>
              View
            </a>
            <a className="cursor-hand" target="_blank" rel="noopener noreferrer" href={product.qrcode.url}>
              Print
            </a>
          </span>
        )
      ),
      sortable: () => false,
    },
  ])

  const ErrorView = () => (
    <h3>{`Error Loading Products: ${error || ''}`}</h3>
  );

  return (
    (!products && loading) ? <Pending /> : 
    (!products || !!error) ? <ErrorView /> : 
    !!products?.length ? (
      <SortableTable
        columns={tableColumns()}
        data={products}
        defaultSort='created'
        noSearch={true}
        maxRows={0}
        filterFn={(product) => product.title + product.date}
        noFilter={true}
        keyFn={(product) => product.id}
        pagination={false}
        pageSize={20}
      />
    ) : false
  )
}

ProductProfilesTable.propTypes = {
  email: PropTypes.string.isRequired,
}

export default ProductProfilesTable