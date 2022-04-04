import Web3 from 'web3'

const web3 = new Web3("https://poa.eth.seutools.com")

const getWeb3 = () => new Promise((resolve, reject) => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      window.ethereum.enable().then(res => {
        resolve([web3, 1]);
      }).catch(reason => reject(reason));
    } catch (error) {
      reject(error);
    }
  } else if (window.web3) {
    resolve([window.web3, 2]);
  } else {
    const web3 = new Web3("https://poa.eth.seutools.com");
    resolve([web3, 3]);
  }
});

const address = {
  predictionMarket: "0x9c8dc95BB304B25C07575B582D5De6990c49f3d2"
}
export default {
  web3,
  getWeb3,
  address
}