import web3 from "../ethereum/web3";
import ethUtil from "ethereumjs-util";

/**
 * Takes the ethereum key and generated the public key for the corresponding address
 * @param {string} from The Ethereum address of the user
 * @returns {string} The public key for the passed ethereum address
 */

export async function getPublicKey(from) {
  const random = window.crypto
    .getRandomValues(new Uint32Array(1))[0]
    .toString();

  const message = web3.utils.sha3(random);

  const signature = await web3.eth.sign(message, from);
  const { v, r, s } = ethUtil.fromRpcSig(signature);
  const publicKeyAsBuffer = ethUtil.ecrecover(
    ethUtil.toBuffer(message),
    v,
    r,
    s
  );
  const publicKey = ethUtil.bufferToHex(publicKeyAsBuffer).slice(2);
  return publicKey;
}
