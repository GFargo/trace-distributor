export const getLotStateField = (lot, state, field) => {
  const details = !!lot.details && lot.details.find(one => one.state === state);
  const value = (!details || !details.data || !details.data[field]) ? null : details.data[field]
  return value;
}

export default {
	getLotStateField
}
