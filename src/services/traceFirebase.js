import firebase from 'firebase/app';
// Required for side-effects
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';

const DEBUG = false;

const { 
  REACT_APP_FIREBASE_APIKEY, 
  REACT_APP_FIRESTORE_PRODUCTS_DB_NAME,
  REACT_APP_FIRESTORE_LOTS_DB_NAME,
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
  const lots = (!value || !value.docs) ? null : (!value.docs.length) ? [] : value.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));
  //console.log('useLots, lots: ', lots);

  return [
    lots,
    loading,
    error,
  ]
}

const userProductsRef = (email) => productsRef.where("owner", "==", email);
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

const cleanObjectProps = (obj) => {
  //console.log('firebase cleanProductFields, object: ', obj);
  if (!obj) return;
  Object.keys(obj).forEach((key) => {
    const objType = typeof obj[key];
    if (!obj[key]) {
      delete obj[key]
    } else if (objType === 'object') {
      cleanObjectProps(obj[key])
      if (!Object.keys(obj[key]).length) {
        delete obj[key]
      }
    } else if (objType === 'array' && !obj[key].length) {
      delete obj[key]
    }
  })
}


export const genLotID = () => lotsRef.doc().id;
export const setLot = async (lot, calback) => {
  if (!lot || !lot.id) {
    console.error('firebase setLot MUST HAVE LOT ID, lot: ', lot);
    return;
  } 
  const id = lot.id;

  const doc = await lotRef(id);
  if (!doc || doc.id !== id) return;

  cleanObjectProps(lot);
  DEBUG && console.log('firebase setLot, lot: ', lot);
  await doc.set(lot);

  //console.log('firebase setProduct complete, id: ', id);
  if (!!calback) calback(id)
  return id;
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

  if (!product.image) product.image = {};
  if (!!product.productImage?.file && product.productImage.type === 'file') {
    product.image.url = await addImageFile(id, 'productImage', product.productImage.file);
  } else if (!!product.productImage?.url && product.productImage.type === 'data') {
    product.image.url = await addImageDataURL(id, 'productImage', product.productImage.url);
    DEBUG && console.log('firebase setProduct, product.image.url: ', product.image.url);
  } else if (!!product.productImage?.url && product.productImage.type === 'firebase') {
    product.image.url = product.productImage.url
  } else {
    product.image.url = '';
  }
  delete product.productImage;

  if (!product.company) product.company = {};
  if (!product.company.logo) product.company.logo = {};
  if (!!product.companyLogo?.file && product.companyLogo.type === 'file') {
    product.company.logo.url = await addImageFile(id, 'companyLogo', product.companyLogo.file);
  } else if (!!product.companyLogo?.url && product.companyLogo.type === 'data') {
    product.company.logo.url = await addImageDataURL(id, 'companyLogo', product.companyLogo.url);
  } else if (!!product.companyLogo?.url && product.companyLogo.type === 'firebase') {
    product.company.logo.url = product.companyLogo.url
  } else {
    product.company.logo.url = '';
  }
  delete product.companyLogo;

  cleanObjectProps(product);

  const doc = await productRef(id);
  if (!doc || doc.id !== id) return;
  await doc.set(product);

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
    DEBUG && console.log('firebase file does not exist - productImage, for ID: ', id, error);
  });
  await store.child(`${id}/companyLogo`).delete().then(() => {
    DEBUG && console.log('firebase file deleted - companyLogo, for ID: ', id);
  }).catch(error => {
    DEBUG && console.log('firebase file does not exist - companyLogo, for ID: ', id, error);
  });
  await store.child(`${id}/qrcode.png`).delete().then(() => {
    DEBUG && console.log('firebase file deleted - qrcode.png, for ID: ', id);
  }).catch(error => {
    DEBUG && console.log('firebase file does not exist - qrcode.png, for ID: ', id, error);
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
}
