import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import SortableTable from '../../core/src/components/SortableTable'
import Button from '../../core/src/components/Elements/Button'
import Pending from '../../core/src/components/Elements/Loader'
import ConfirmationModal from '../../core/src/components/Elements/Modal/Confirmation'
import { localizeDateFromString } from '../../core/src/utils/date-time/utils'
import { useProducts, deleteProductProfile } from '../../services/traceFirebase';


const ProductProfilesTable = ({ email }) => {
  const [products, loading, error] = useProducts(email); 
  //console.log('ProductProfilesTable, products: ', products);

  const [ deleteThisProductID, setDeleteModal ] = useState(false);

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
        <span className="" data-toggle="tooltip" data-placement="top" title="View Product Lot">
          <Link to={"/processing/"+product.productLot}>
            {`${product.productLot.substr(0, 20)}...`}
          </Link>
        </span>),
      sortable: (product) => product.productLot
    },
    {
      name: 'page',
      displayName: 'Profile Page',
      displayValue: (product) => (
        !!product?.id && !!product?.url && (
          <span className="">
            <a className="" target="_blank" rel="noopener noreferrer" href={product.qrcode.url}>
              <span className="icon icon-qrcode mr-2 text-2xl text-gold-500 hover:text-gold-900" data-toggle="tooltip" data-placement="top" title="View QR Code"></span>
            </a>
            <a 
              className="" 
              target="_blank" 
              rel="noopener noreferrer" 
              href={product.url}
            >
              <span className="icon icon-file-o mr-2 text-2xl text-gold-500 hover:text-gold-900" data-toggle="tooltip" data-placement="top" title="View Profile"></span>
            </a>
            <Link to={"/distributor/product-profile-form/"+product.id}>
              <span className="icon icon-pencil mr-2 text-2xl text-gold-500 hover:text-gold-900" data-toggle="tooltip" data-placement="top" title="Edit Profile"></span>
            </Link>
            <span className="" data-toggle="tooltip" data-placement="top" title="Delete Profile">
              <Button
                className="icon icon-delete -ml-4 text-2xl text-gold-500 hover:text-gold-900"
                color="transparent"
                onClickHandler={() => setDeleteModal(product.id)}>
              </Button>
            </span>
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
      <div className="container">
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
          noSearch={true}
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
  email: PropTypes.string.isRequired,
}

export default ProductProfilesTable;
