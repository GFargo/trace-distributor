import firebase from 'firebase/app';
// Required for side-effects
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';
import { cleanObjectProps } from '../helpers/utils';

const DEBUG = false;

const { 
  REACT_APP_FIREBASE_APIKEY, 
  REACT_APP_FIRESTORE_PRODUCTS_DB_NAME = 'product-profiles-dev',
  REACT_APP_FIRESTORE_LOTS_DB_NAME = 'lots-dev',
  REACT_APP_FIREBASE_AUTH_EMAIL,
  REACT_APP_FIREBASE_AUTH_PW 
} = process.env;
//console.log('firebase init, process.env: ', process.env);

// TODO move secrets to env vars
const firebaseConfig = {
  apiKey: REACT_APP_FIREBASE_APIKEY,
  authDomain: "trace-public-product-backend.firebaseapp.com",
  databaseURL: "https://trace-public-product-backend.firebaseio.com",
  projectId: "trace-public-product-backend",
  storageBucket: "trace-public-product-backend.appspot.com",
  messagingSenderId: "583899937939",
  appId: "1:583899937939:web:67f09728e8ded9493ce166",
  measurementId: "G-XD4P3V7JMP",
};

firebase.initializeApp(firebaseConfig);
DEBUG && console.log('firebase init, firebase: ', firebase);

const auth = firebase.auth();
auth.signInWithEmailAndPassword(
  REACT_APP_FIREBASE_AUTH_EMAIL, 
  REACT_APP_FIREBASE_AUTH_PW
).catch( error => {
  console.error('firebase auth error: ', error.message);
});

const store = firebase.storage().ref();
const db = firebase.firestore();

const lotsRef = db.collection(REACT_APP_FIRESTORE_LOTS_DB_NAME);
const lotRef = (id) => lotsRef.doc(id);

const userLotsRef = (email) => !!email && lotsRef.where("owner", "==", email);
export const useLots = (email) => {
  const [value, loading, error] = useCollection(userLotsRef(email)); 
  let lots = (!value || !value.docs) ? null : (!value.docs.length || loading) ? [] : value.docs.map(doc => ({
    ...doc.data(),
    id: doc.id
  }));
  if (!!lots?.length) {
    lots = lots.map(lot => ({
      ...lot,
      parentLot: (!!lot.parentLot) ? lots.find(
        one => one.address === lot.parentLot.address) || lot.parentLot : null,
      subLots: (!!lot.subLots?.length) ? lot.subLots.map(
        subLot => lots.find(one => one.address === subLot.address) || subLot) : [],
      details: lot.details || [],
    }));
  }
  
  DEBUG && console.log('useLots, lots: ', lots);

  return [
    lots,
    loading,
    error,
  ]
}

const productsRef = db.collection(REACT_APP_FIRESTORE_PRODUCTS_DB_NAME);

const userProductsRef = (email) => !!email && productsRef.where("owner", "==", email);
const lotProductsRef = (address) => productsRef.where("productLot", "==", address);
const productRef = (id) => productsRef.doc(id);

export const getProduct = async (id, callback) => {
  const snap = await productsRef.doc(id).get();
  const product = snap.data();
  if (!!callback) callback(product);
  return product;
}

export const useProducts = (email) => {
  const [value, loading, error] = useCollection(userProductsRef(email)); 
  const products = (!value || !value.docs) ? null : (!value.docs.length) ? [] : value.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));
  DEBUG && console.log('useProducts, products: ', products);

  return [
    products,
    loading,
    error,
  ]
}

export const useProduct = (id) => {
  const [value, loading, error] = useDocument(productRef(id)); 
  const product = (!value || !value.data) ? null : value.data();
  if (!!product && !product.id) product.id = value.id;
  DEBUG && console.log('useProduct, product: ', product);

  return [
    product,
    loading,
    error,
  ]
}

export const useLatestLotProduct = (address) => {
  const [value, loading, error] = useCollection(lotProductsRef(address)); 
  //console.log('useLatestLotProduct, value: ', value);
  const products = (!value || !value.docs) ? null : (!value.docs.length) ? [] : value.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));
  //console.log('useLatestLotProduct, products: ', products);
  let product = null;
  if (!!products?.length) {
    products.forEach( p => {
      if (!product || p.created > product.created) product = p;
    })
  }

  return [
    product,
    loading,
    error,
  ]
}

const addImageDataURL = async (id, name, imageDataURL) => {
  const uploadTask = await store.child(`${id}/${name}`).putString(imageDataURL, 'data_url');
  DEBUG && console.log('firebase addImageDataURL, uploadTask: ', uploadTask);
  const url = await uploadTask.ref.getDownloadURL();
  DEBUG && console.log('firebase addImageDataURL, url: ', url);
  return url;
}

const addImageFile = async (id, name, imageFile) => {
  const uploadTask = await store.child(`${id}/${name}`).put(imageFile);
  DEBUG && console.log('firebase addImageFile, uploadTask: ', uploadTask);
  const url = await uploadTask.ref.getDownloadURL();
  DEBUG && console.log('firebase addImageFile, url: ', url);
  return url;
}

const uploadImage = async (id, name, image) => {
  let url = '';
  if (!!image?.file && image.type === 'file') {
    url = await addImageFile(id, name, image.file);
  } else if (!!image?.url && image.type === 'data') {
    url = await addImageDataURL(id, name, image.url);
    DEBUG && console.log('firebase uploadImage, url: ', url);
  } else if (!!image?.url) {
    url = image.url;
  }
  return url;
}

export const uploadLotImages = async (lot) => {
  if (!lot.details) return lot;
  const details = [ ...lot.details ];// Deep copy maybe
  for (let i=0; i<lot.details.length; i++) {
    if (!!lot.details[i]?.data?.images?.length){
      for (let j=0; j<lot.details[i].data.images.length; j++) {
        if (!!details[i].data.images[j]?.image && (
            details[i].data.images[j].image.type === 'file' || 
            details[i].data.images[j].image.type === 'data' )) {
          const url = await uploadImage(lot.id, details[i].state+j, details[i].data.images[j].image);
          details[i].data.images[j].image = {url};
          DEBUG && console.log('firebase uploadLotImages uploaded:', details[i].data.images[j].image);
        }
      }
    }
  }
  const uploadedLot = { ...lot, details };
  DEBUG && console.log('firebase uploadLotImages uploadedLot: ', uploadedLot);
  return uploadedLot;
}

export const genLotID = () => lotsRef.doc().id;

export const updateLots = async (lots, email, callback) => {
  if (!lots || !lots.length) return;

  DEBUG && console.log('firebase updateLots, lots: ', lots);

  const snap = await userLotsRef(email).get();
  DEBUG && console.log('firebase updateLots, snap: ', snap);
  const fbLotHashs = (!!snap?.docs?.length) ? snap.docs.map(doc => doc.data().infoFileHash) : [];
  const fbLotAddresses = (!!snap?.docs?.length) ? snap.docs.map(doc => doc.data().address) : [];
  DEBUG && console.log('firebase updateLots, fbLotHashs: ', fbLotHashs);

  let lotUpdates = lots.filter(each => !fbLotHashs.includes(each.infoFileHash || 'NOT'));
  DEBUG && console.log('firebase updateLots, A lotUpdates: ', lotUpdates);
  lotUpdates = lotUpdates.filter(each => !(!each.infoFileHash && fbLotAddresses.includes(each.address)));
  DEBUG && console.log('firebase updateLots, B lotUpdates: ', lotUpdates);

  lotUpdates.forEach(lotData => {
    const lot = cleanObjectProps(lotData);
    if (!lot.owner) lot.owner = email;
    if (!lot.infoFileHash) lot.infoFileHash = 'new';
    if (fbLotAddresses.includes(lot.address)) {
      const doc = snap.docs.find(one => one.data().address === lot.address);
      if (!!lot.infoFileHash && !!doc.data().infoFileHash) lot.prevInfoFileHash = doc.data().infoFileHash;
      lotRef(doc.id).set(lot);
      DEBUG && console.log('firebase update Lot, lot: ', lot);
    } else {
      lotsRef.add(lot);
      DEBUG && console.log('firebase add Lot, lot: ', lot);
    }
  });
  DEBUG && console.log('firebase lotUpdates complete.');
  if (!!callback) callback()
}

export const setLot = async (lot, callback) => {
  if (!lot || !lot.id) {
    console.error('firebase setLot MUST HAVE LOT ID, lot: ', lot);
    return;
  } 

  await lotRef(lot.id).set(lot);

  if (!!callback) callback()
  return;
}

export const genProductID = () => productsRef.doc().id;
export const setProductProfile = async (product, calback) => {
  if (!product || !product.id || (!product.existingQRCode && !product.qrcode)) {
    console.error('firebase setProduct MUST HAVE PRODUCT ID, product: ', product);
    return;
  } 
  if (!product.existingQRCode && !product.qrcode) {
    console.error('firebase setProduct MUST HAVE QR CODE, product: ', product);
    return;
  } 
  DEBUG && console.log('firebase setProduct, product: ', product);
  const id = product.id;

  const qrcodeDataURL = product.qrcode;
  product.qrcode = { url: '' };
  if (!!product.existingQRCode) {
    product.qrcode.url = product.existingQRCode;
    delete product.existingQRCode;
  } else {
    product.qrcode.url = await addImageDataURL(id, 'qrcode.png', qrcodeDataURL);
  }

  if (!!product.companyLogo) {
    if (!product.image || !product.image.url) {
      product.image = {};
      product.image.url = await uploadImage(id, 'productImage', product.productImage);
    }
  }
  delete product.productImage;

  if (!!product.companyLogo) {
    if (!product.company) product.company = {};
    if (!product.company.logo || !product.company.logo.url) {
      product.company.logo = {};
      product.company.logo.url = await uploadImage(id, 'companyLogo', product.companyLogo);
    }
  }
  delete product.companyLogo;

  const doc = await productRef(id).get();
  if (!doc || doc.id !== id) return;
  const cleaned = cleanObjectProps(product);
  await productRef(id).set(cleaned);

  DEBUG && console.log('firebase setProduct complete, id: ', id);
  if (!!calback) calback(id)
  return id;
}

export const deleteProductProfile = async (id) => {
  if (!id) {
    console.error('firebase deleteProduct MUST HAVE PRODUCT ID, id: ', id);
    return;
  } 
  await store.child(`${id}/productImage`).delete().then(() => {
    DEBUG && console.log('firebase file deleted - productImage, for ID: ', id);
  }).catch(error => {
    console.error('firebase file does not exist - productImage, for ID: ', id, error);
  });
  await store.child(`${id}/companyLogo`).delete().then(() => {
    DEBUG && console.log('firebase file deleted - companyLogo, for ID: ', id);
  }).catch(error => {
    console.error('firebase file does not exist - companyLogo, for ID: ', id, error);
  });
  await store.child(`${id}/qrcode.png`).delete().then(() => {
    DEBUG && console.log('firebase file deleted - qrcode.png, for ID: ', id);
  }).catch(error => {
    console.error('firebase file does not exist - qrcode.png, for ID: ', id, error);
  });
  await productRef(id).delete().then(function() {
    DEBUG && console.log('firebase doc deleted, for ID: ', id);
  }).catch(function(error) {
    console.error('firebase error deleting doc, for ID: ', id);
    console.error('firebase error: ', error);
  });

}

export default {
  useProducts,
  useProduct,
  useLatestLotProduct,
  getProduct,
  genProductID,
  setProductProfile,
  deleteProductProfile,
  uploadLotImages,
}
