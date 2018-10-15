import db from "../utils/firebase";
import Router from "next/router";

export function updateInterface(selectedAddress, networkVersion) {
  db.ref("/users/" + selectedAddress.toLowerCase())
    .once("value")
    .then(snapshot => {
      const userPublicKey = snapshot.val() && snapshot.val().public_key;
      if (userPublicKey) {
        window.location.reload();
      } else {
        Router.push("/");
      }
    });
}
