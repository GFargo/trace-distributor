

export const cleanObjectProps = (o) => {
  //console.log('firebase cleanProductFields, object: ', obj);
  if (!o || typeof o !== 'object') return o;
  const obj = {...o}; // TODO replace with deep copy function if needed
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
  return obj;
}