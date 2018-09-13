export async function sha256(data) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data); // hash the data
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert hash to byte array
  const hashHex = hashArray
    .map(b => ("00" + b.toString(16)).slice(-2))
    .join(""); // convert bytes to hex string
  return hashHex;
}
