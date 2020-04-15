const ipfsClient = require('ipfs-http-client');
const ipfs = new ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const filePath = file => `trace-data/${file.id}`
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
