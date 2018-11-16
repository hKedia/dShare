/**
 * Generated a symmetric key and encrypts the file
 * @param {ArrayBuffer} data The file to be encrypted
 * @returns {object} The object with the encrypted data, the random value and the key
 */

export async function encrypt(data) {
  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const cypher = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  return {
    data: cypher,
    iv: iv,
    key: key
  };
}

/**
 * Decrypts the file
 * @param {ArrayBuffer} data The file to be decrypted
 * @param {JsonWebKey} key The decryption key
 * @param {number} iv The random value used to encrypt the file
 * @returns {ArrayBuffer} The decrypted file
 */

export async function decrypt(data, key, iv) {
  return await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );
}
