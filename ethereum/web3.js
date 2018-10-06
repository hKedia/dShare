import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // In the browser and Metamask is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are in server or no Metamask installed
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/c74a69eb751343ec8134914aa42a6a61"
  );
  web3 = new Web3(provider);
}

export default web3;
