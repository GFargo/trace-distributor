const ipfsClient = require('ipfs-http-client');
const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const lotPath = (lot) => `trace-data/${lot.created}`
const lotContent = (lot) => ipfsClient.Buffer.from(JSON.stringify(lot))

export const ipfsAddLotState = async (lot, onlyHash = false, callback) => {
  if (!lot) return null;
  let hashedLot = { ...lot };
  if (hashedLot.hasOwnProperty('infoFileHash')) {
    if (!!hashedLot.infoFileHash) hashedLot.prevInfoFileHash = hashedLot.infoFileHash;
    delete hashedLot.infoFileHash;
  }
  const files = [{
    path: lotPath(hashedLot),
    content: lotContent(hashedLot)
  }]
  //console.log('ipfsAddLot, files ==> ', files);
  
  let infoFileHash;
  try {
    for await (const result of ipfs.add(files, {onlyHash})) {
      //console.log('ipfsAddLot, result ==> ', result);
      if (!!result?.cid?.string && result.path === lotPath(hashedLot)) {
        infoFileHash = result.cid.string;
      }
    }
    if (!!infoFileHash) {
      //console.log('ipfsAddLot, infoFileHash ==> ', infoFileHash);
      hashedLot = {...hashedLot, infoFileHash};
      console.log('ipfsAddLot, hashedLot ==> ', hashedLot);
    } else {
      console.error('ipfsAddLot, Uh oh infoFileHash is null!');
    }
  } catch (e) {
    console.error('ipfsAddLot error:', e);
  } finally {
    if (!!callback) callback(hashedLot);
    return hashedLot;
  }
}
