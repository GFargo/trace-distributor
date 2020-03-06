import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import SortableTable from '../../core/src/components/SortableTable'
import Button from '../../core/src/components/Elements/Button'
import Pending from '../../core/src/components/Elements/Loader'
import ReactModal from 'react-modal';
import { localizeDateFromString } from '../../core/src/utils/date-time/utils'
import { useProducts, deleteProductProfile } from '../../services/traceFirebase';


const ProductProfilesTable = ({ email }) => {
  const [products, loading, error] = useProducts(email); 
  //console.log('ProductProfilesTable, products: ', products);

  const [ deleteModal, setDeleteModal ] = useState(false);

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
            <span className="" data-toggle="modal" data-target="#exampleModal">
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

  const DeleteModal = () => (
    <ReactModal
      closeTimeoutMS={200}
      isOpen={!!deleteModal}
      contentLabel={'Modal Content'}
      ariaLabel="Confirmation dialogue:"
      ariaCloseLabel="Close confirmation dialogue"
      ariaHideApp={false}
      className={`bg-white rounded`}
      overlayClassName={`fixed z-50 flex self-stretch justify-center items-center h-screen top-0 left-0 min-w-full`}
      style={{
        overlay: { inset: '0px', backgroundColor: 'rgba(255, 255, 255, 0.75)' },
      }}
      onRequestClose={() => setDeleteModal(false)}
    >
      <div className="relative">
        <span className="absolute top-0 bottom-0 right-0 p-4 z-10">
          <button type="button" onClick={() => setDeleteModal(false)}>
            <span className="sr-only">Close</span>
            <span className="icon icon-delete mr-2 text-2xl text-gold-500 hover:text-gold-900"></span>
          </button>
        </span>
        <div className="pt-12 pb-12 mr-4 ml-4 text-center">
          <div className="font-body text-md font-normal">
            <h3 className="text-lg font-bold mb-4 px-4">{`Confirm Delete Product Profile?`}</h3>
            <Button
              onClickHandler={() => setDeleteModal(false)}
              color={'red'}
              className="mr-4"
              type="button"
            >
              Cancel
            </Button>
            <Button
              color={'gold'}
              onClickHandler={() => {
                const id = deleteModal;
                console.log('Deleting Product Profile ID:', id);
                deleteProductProfile(id);
                setDeleteModal(false);
              }}
              className="ml-4"
              type="button"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </ReactModal>
  );

  return (
    (!products && loading) ? <Pending /> : 
    (!products || !!error) ? <ErrorView /> : 
    !!products?.length ? (
      <div className="container">
        <DeleteModal />
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
