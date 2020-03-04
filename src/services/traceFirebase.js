import firebase from 'firebase/app';
// Required for side-effects
import 'firebase/firestore';
import 'firebase/storage';
import { useDocument, useCollection } from 'react-firebase-hooks/firestore';

// TODO move secrets to env vars
//const TRACE_PW = 'trace$_ 2020'
const firebaseConfig = {
  apiKey: "AIzaSyA50fd2T2VVBORsYFCGIRBfwamCGJhoRiM",
  authDomain: "trace-public-product-backend.firebaseapp.com",
  databaseURL: "https://trace-public-product-backend.firebaseio.com",
  projectId: "trace-public-product-backend",
  storageBucket: "trace-public-product-backend.appspot.com",
  messagingSenderId: "583899937939",
  appId: "1:583899937939:web:67f09728e8ded9493ce166",
  measurementId: "G-XD4P3V7JMP"
};

firebase.initializeApp(firebaseConfig);
//console.log('firebase init, firebase: ', firebase);

const store = firebase.storage().ref();
const db = firebase.firestore();
const productsRef = db.collection('product-profiles');

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
  //console.log('ProductPage, product: ', product);

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
  console.log('ProductPage, product: ', product);

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
  console.log('useLatestLotProduct, products: ', products);
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

const addProductImage = async (id, productImage) => {
	const uploadTask = await store.child(id+'/productImage').put(productImage);
	//console.log('firebase addProductImage, uploadTask: ', uploadTask);
	const url = await uploadTask.ref.getDownloadURL();
	console.log('firebase addProductImage, url: ', url);
	return url;
}
/*
const deleteProductImage = async (id, productImage) => {
	const deleteTask = await store.child(id+'/productImage').delete();
	console.log('firebase deleteProductImage, deleteTask: ', deleteTask);
}
*/
const addCompanyLogo = async (id, companyLogo) => {
	const uploadTask = await store.child(id+'/companyLogo').put(companyLogo);
	//console.log('firebase addCompanyLogo, uploadTask: ', uploadTask);
	const url = await uploadTask.ref.getDownloadURL();
	console.log('firebase addCompanyLogo, url: ', url);
	return url;
}
/*
const deleteCompanyLogo = async (id, companyLogo) => {
	const deleteTask = await store.child(id+'/companyLogo').delete();
	console.log('firebase deleteCompanyLogo, deleteTask: ', deleteTask);
}
*/
const addQRCodeDataURL = async (id, qrcodeDataURL) => {
	const uploadTask = await store.child(id+'/qrcode.png').putString(qrcodeDataURL, 'data_url');
	//console.log('firebase addQRCodeImageURL, uploadTask: ', uploadTask);
	const url = await uploadTask.ref.getDownloadURL();
	console.log('firebase addQRCodeDataURL, url: ', url);
	return url;
}

const cleanObjectProps = (obj) => {
  console.log('firebase cleanProductFields, object: ', obj);
  if (!obj) return;
  Object.keys(obj).forEach((key) => {
    if (!obj[key]) {
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      cleanObjectProps(obj[key])
      if (!Object.keys(obj[key]).length) {
        delete obj[key]
      }
    } else if (typeof obj[key] === 'array' && !obj[key].length) {
      delete obj[key]
    }
  })
}

export const deleteProductProfile = async (id) => {
  if (!id) {
    console.error('firebase deleteProduct NO PRODUCT ID, id: ', id);
    return;
  } 

  let deleteTask = await store.child(`${id}/productImage`).delete();
  console.log('firebase deleteProduct productImage, deleteTask: ', deleteTask);

  deleteTask = await store.child(`${id}/companyLogo`).delete();
  console.log('firebase deleteProduct companyLogo, deleteTask: ', deleteTask);

  deleteTask = await store.child(`${id}/qrcode.png`).delete();
  console.log('firebase deleteProduct qrcode, deleteTask: ', deleteTask);

  deleteTask = await productRef(id).delete();
  console.log('firebase deleteProduct product, deleteTask: ', deleteTask);
}

export const genProductID = () => productsRef.doc().id;
export const setProductProfile = async (product, calback) => {
	if (!product || !product.id) {
    console.error('firebase setProduct NO PRODUCT ID, product: ', product);
    return;
  } 
	const productImage = product.productImage;
	delete product.productImage;
	const companyLogo = product.companyLogo;
	delete product.companyLogo;
	const qrcodeDataURL = product.qrcode;
	delete product.qrcode;
  const existingQRCode = product.existingQRCode;
  delete product.existingQRCode;

	console.log('firebase setProduct starting, product: ', product);
  cleanObjectProps(product)
  console.log('firebase setProduct cleaned, product: ', product);

  const doc = await productRef(product.id);
  await doc.set(product);
  console.log('firebase setProduct set doc: ', doc);

	if (!doc || !doc.id) return;
	const { id } = doc; 

	if (!!productImage && typeof productImage === "string") {//existing
    await doc.update({image: {url: productImage}});
    //console.log('firebase setProduct, exsting productImage: ', productImage);
  } else if (!!productImage) {
		const productImageURL = await addProductImage(id, productImage);
		//console.log('firebase setProduct, productImageURL: ', productImageURL);
		await doc.update({image: {url: productImageURL}});
	}

	if (!!companyLogo && typeof companyLogo === "string") {//existing
    await doc.update({company: { ...product.company, logo: {url: companyLogo}}});
    //console.log('firebase setProduct, exsting companyLogo: ', companyLogo);
  } else if (!!companyLogo) {
		const companyLogoURL = await addCompanyLogo(id, companyLogo);
		//console.log('firebase setProduct, addCompanyLogo: ', companyLogoURL);
		await doc.update({company: { ...product.company, logo: {url: companyLogoURL}}});
	}

	if (!!existingQRCode) {//existing
    await doc.update({qrcode: {url: existingQRCode}});
    //console.log('firebase setProduct, exsting QRCode: ', existingQRCode);
  } else if (!!qrcodeDataURL) {
		const qrcodeImageURL = await addQRCodeDataURL(id, qrcodeDataURL);
		//console.log('firebase setProduct, qrcodeImageURL: ', qrcodeImageURL);
		await doc.update({qrcode: {url: qrcodeImageURL}});
	}

	//console.log('firebase setProduct complete, id: ', id);
	if (!!calback) calback(id)
	return id;
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