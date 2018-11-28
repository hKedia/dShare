import Web3 from "web3";
import db from "../utils/firebase";
import Router from "next/router";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // In the browser and Metamask is running
  web3 = new Web3(window.ethereum);
  /** Prompting user for account access */
  window.ethereum.enable();
} else if (
  typeof window !== "undefined" &&
  typeof window.web3 !== "undefined"
) {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are in server or no Metamask installed
  const provider = new Web3.providers.HttpProvider(process.env.RINKEBY_URL);
  web3 = new Web3(provider);
}

/** Listener for account change in metamask */
if (web3.currentProvider.publicConfigStore) {
  web3.currentProvider.publicConfigStore.on(
    "update",
    async ({ selectedAddress, networkVersion }) => {
      let snapshot;
      /** Handling the case when metamask is locked */
      try {
        snapshot = await db
          .ref("/users/" + selectedAddress.toLowerCase())
          .once("value");
      } catch (error) {
        return;
      }
      if (snapshot.val() == null) {
        Router.push("/login");
      }
    }
  );
}

export default web3;
