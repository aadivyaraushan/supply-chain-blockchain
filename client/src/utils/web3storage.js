import { Web3Storage } from 'web3.storage';

function getAccessToken() {
  return process.env.REACT_APP_WEB3STORAGE_TOKEN;
}

export function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}
