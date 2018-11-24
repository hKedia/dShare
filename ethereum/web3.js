import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // In the browser and Metamask is running
  web3 = new Web3(window.ethereum);
  /** Prompting user for account access */
  window.ethereum.enable();
} else if (typeof window !== "undefined" && window.web3 !== "undefined") {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are in server or no Metamask installed
  const provider = new Web3.providers.HttpProvider(process.env.RINKEBY_URL);
  web3 = new Web3(provider);
}

export default web3;
