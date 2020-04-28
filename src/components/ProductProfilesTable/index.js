import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import SortableTable from '../../core/src/components/SortableTable'
import { Button, PageLoader, ConfirmationModal } from '../../core/src/components/Elements'
import { localizeDateFromString } from '../../core/src/utils/date-time/utils'
import { deleteProductProfile } from '../../services/traceFirebase';


const TRACE_DIRECTORY =
  process.env.REACT_APP_TRACE_DIRECTORY ||
  'https://develop.trace.directory/lot/';

const ProductProfilesTable = ({ productsCollection }) => {
  
  const [ products, loading, error ] = productsCollection;
  //console.log('ProductProfilesTable, products: ', products);

  const [ deleteThisProductID, setDeleteModal ] = useState(false);

  const tableColumns = () => ([
    {
      name: 'date',
      displayName: 'Date',
      displayValue: (product) => localizeDateFromString(new Date(product.created)),
      sortable: (product) => localizeDateFromString(new Date(product.created))
    },
    {
      name: 'title',
      displayName: 'Product Name',
      displayValue: (product) => (
        <Link 
          to={`/distributor/product-profile-form/${product.id}`}
          className="hover:text-gold-400"
        >
          {product.title}
        </Link>
      ),
      sortable: (product) => product.title
    },
    {
      name: 'lots',
      displayName: '# of Lots',
      displayValue: (product) => (!!product?.lots && !!Object.keys(product.lots).length) 
        ? Object.keys(product.lots).length 
        : 0,
      sortable: (product) => (!!product?.lots && !!Object.keys(product.lots).length) 
        ? Object.keys(product.lots).length 
        : 0
    },
    {
      name: 'address',
      displayName: 'Blockchain Address',
      displayValue: (product) => (
        <span className="" data-toggle="tooltip" data-placement="top" title="View Product Lot">
          <Link 
            to={"/processing/"+product.productLot}
            className="hover:text-gold-400"
          >
            {`${product.productLot.substr(0, 20)}...`}
          </Link>
        </span>),
      sortable: (product) => product.productLot
    },
    {
      name: 'page',
      displayName: 'Profile Page',
      displayValue: (product) => (
        !!product?.id && (
          <div className="flex items-center justify-start">
            <span className="flex" data-toggle="tooltip" data-placement="top" title="View QR Code">
              <Button
                type="external"
                to={product.qrcode.url}
                className="flex text-gray-500 mr-1"
                color="transparent"
                size="icon"
                icon="qrcode"
                iconSize="lg"
                iconMargin="0"
              />
            </span>

            <span className="flex" data-toggle="tooltip" data-placement="top" title="Edit Product Profile">
              <Button
                type="link"
                to={`/distributor/product-profile-form/${product.id}`}
                className="flex text-gray-500 mr-1"
                color="transparent"
                size="icon"
                icon="edit"
                iconSize="lg"
                iconMargin="0"
              />
            </span>
            <span className="flex" data-toggle="tooltip" data-placement="top" title="View Product Profile">
              <Button
                type="external"
                to={`${TRACE_DIRECTORY}${product.id}`}
                className="flex text-gray-500 mr-1"
                color="transparent"
                size="icon"
                icon="file-o"
                iconSize="lg"
                iconMargin="0"
              />
            </span>
            
            <span className="flex" data-toggle="tooltip" data-placement="top" title="Delete Product Profile">
              <Button
                className="flex text-gray-500 hover:text-red-500 bg-transparent mr-1"
                color="custom"
                size="icon"
                icon="delete"
                iconSize="lg"
                iconMargin="0"
                onClickHandler={() => setDeleteModal(product.id)}
              />
            </span>

          </div>
        )
      ),
      sortable: () => false,
    },
  ])

  const ErrorView = () => (
    <h3>{`Error Loading Products: ${error || ''}`}</h3>
  );

  return (
    (!products && loading) ? <div className="py-16"><PageLoader /></div> : 
    (!products || !!error) ? <ErrorView /> : 
    !!products?.length ? (
      <div className="">
        <ConfirmationModal
          modal={{ isOpen: !!deleteThisProductID, setOpen: setDeleteModal }}
          titleText={"Are you sure you want to delete this product?"}
          imgSrc="/img/cropped/rejected.png"
          confirmFn={() => {
            // Do stuff on confirm button press.
            if (!deleteThisProductID) return;
            const id = deleteThisProductID;
            console.log('Deleting Product Profile ID:', id);
            deleteProductProfile(id);
            setDeleteModal(false);
          }}
          cancelFn={() => {
            setDeleteModal(false)
          }}
        />
        <SortableTable
          columns={tableColumns()}
          data={products}
          defaultSort="date"
          defaultSortOrder="desc"
          // noSearch={true}
          maxRows={0}
          filterFn={(product) => product.title + product.date}
          noFilter={true}
          keyFn={(product) => product.id}
          pagination={false}
          pageSize={20}
        />
      </div>
    ) : false
  )
}

ProductProfilesTable.propTypes = {
  productsCollection: PropTypes.array.isRequired,
}

export default ProductProfilesTable;
