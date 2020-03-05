import React from 'react';
import PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import SortableTable from '../../core/src/components/SortableTable'
import Pending from '../../core/src/components/Elements/Loader'
import { localizeDateFromString } from '../../core/src/utils/date-time/utils'
import { useProducts } from '../../services/traceFirebase';


const ProductProfilesTable = ({ email }) => {
  const [products, loading, error] = useProducts(email); 
  //console.log('ProductProfilesTable, products: ', products);

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
          {`${product.productLot.substr(0, 20)}...`}
        </Link>),
      sortable: (product) => product.productLot
    },
    {
      name: 'page',
      displayName: 'Profile Page',
      displayValue: (product) => (
        !!product?.id && !!product?.url && (
          <span className="">
            <a 
              className="" 
              target="_blank" 
              rel="noopener noreferrer" 
              href={product.url}
            >
              <span className="icon icon-file-o mr-2 text-2xl text-gold-500 hover:text-gold-900"></span>
            </a>
            <Link to={"/distributor/product-profile-form/"+product.id}>
              <span className="icon icon-pencil mr-2 text-2xl text-gold-500 hover:text-gold-900"></span>
            </Link>
            <a className="" target="_blank" rel="noopener noreferrer" href={product.qrcode.url}>
              <span className="icon icon-qrcode mr-2 text-2xl text-gold-500 hover:text-gold-900"></span>
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
        defaultSort="date"
        defaultSortOrder="desc"
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

export default ProductProfilesTable;
