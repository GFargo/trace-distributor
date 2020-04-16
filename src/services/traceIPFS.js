const IPFS_SERVER =
  process.env.REACT_APP_IPFS_SERVER ||
  'ipfs.infura.io';

const IPFS_PORT =
  process.env.REACT_APP_IPFS_PORT ||
  5001;

const IPFS_PROTOCOL =
  process.env.REACT_APP_IPFS_PROTOCOL ||
  'https';

const IPFS_PATH =
  process.env.REACT_APP_IPFS_PATH ||
  'trace-data/';

const ipfsClient = require('ipfs-http-client');
const ipfs = new ipfsClient({ host: IPFS_SERVER, port: IPFS_PORT, protocol: IPFS_PROTOCOL });

const filePath = file => `${IPFS_PATH}${file.id}`
const fileContent = file => ipfsClient.Buffer.from(JSON.stringify(file))

export const ipfsAddFile = async (file, onlyHash) => {
  if (!file) return null;
  const files = [{
    path: filePath(file),
    content: fileContent(file)
  }]

  let fileHash;
  try {
    for await (const result of ipfs.add(files, {onlyHash})) {
      if (!!result?.cid?.string && result.path === filePath(file)) {
        fileHash = result.cid.string;
      }
    }
  } catch (e) {
    console.error('ipfsAddFile error:', e);
  } 
  return fileHash;
}
