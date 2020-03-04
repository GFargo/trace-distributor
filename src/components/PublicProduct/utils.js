export const getLotStateField = (lot, state, field) => {
  const cat = !!lot.details && lot.details.find(one => one.state === state);
  const value = (!cat || !cat.data || !cat.data[field]) ? null : cat.data[field]
  return value;
}

export default {
	getLotStateField
}
