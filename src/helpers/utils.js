/**
 * Returns a recursively cleaned object, with deleted: nulls, empty objects, 
 * undefineds, empty arrays, and empty strings.
 *
 * @export
 * @param {*} obj
 * @returns new appended obj.
 */
export const cleanObjectProps = (o) => {
  if (!o || typeof o !== 'object') return o;
  const obj = {...o}; // TODO replace with deep copy function if needed
  Object.keys(obj).forEach((key) => {
    const objType = typeof obj[key];
    if (objType === 'object') {
      if (!obj[key] || !Object.keys(obj[key]).length) {
        delete obj[key];// delete null or empty objects
      } else {
        cleanObjectProps(obj[key]);// recurse into object
      }
    } else if (!obj[key] && (objType === 'string' || objType === 'undefined')) {
      delete obj[key];// delete empty strings and undefined
    } else if (objType === 'array' && !obj[key].length) {
      delete obj[key];// delete empty arrays
    }
  })
  return obj;
}
