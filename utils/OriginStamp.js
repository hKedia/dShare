/**
 * Creates the timestamp by submitting the timestamp to the OriginStamp API
 * @param {string} hash File's sha3 hash
 * @param {string} email The email address of the user
 * @returns {json} The response received from the API
 */

export function createTimeStamp(hash, email) {
  const data = {
    comment: "",
    hash: hash,
    notifications: [
      {
        currency: 0,
        notification_type: 0,
        target: email
      }
    ],
    url: ""
  };

  return fetch("https://api.originstamp.com/v3/timestamp/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: process.env.ORIGINSTAMP_API_KEY
    },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json();
  });
}

/**
 * Gets the timestamp status for a given hash
 * @param {string} hash File's sha3 hash
 * @returns {json} The response from the API
 */

export function timestampStatus(hash) {
  return fetch(`https://api.originstamp.com/v3/timestamp/${hash}`, {
    method: "GET",
    headers: {
      Authorization: process.env.ORIGINSTAMP_API_KEY
    }
  }).then(response => {
    return response.json();
  });
}

/**
 * Converts the status code into a meaningful sentence
 * @param {number} status_code The status code for a timestamp response
 * @returns {string}
 */

export function getStatusMessage(status_code) {
  switch (status_code) {
    case 0:
      return "The hash is not yet broadcasted to the network.";
      break;
    case 1:
      return "The hash was included into a transaction and broadcasted to the network, but not included into a block.";
      break;
    case 2:
      return "The transaction was included into the latest block.";
      break;
    case 3:
      return "The timestamp for the file was successfully created.";
      break;
    default:
      return "No Data Found!";
  }
}

/**
 * Fetches the timestamp proof for a given hash from the OriginStamp API
 * @param {string} filehash File's sha3 hash
 * @returns {string|xml}
 */

export function getTimestampProof(filehash) {
  const data = {
    currency: 0,
    hash_string: filehash,
    proof_type: 0
  };

  return fetch("https://api.originstamp.com/v3/timestamp/proof", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: process.env.ORIGINSTAMP_API_KEY
    },
    body: JSON.stringify(data)
  }).then(response => {
    /** Read the response headers */
    const headerContent = response.headers.get("content-disposition");

    /** Check for existence of proof for the submitted hash */
    if (headerContent === null) {
      return;
    }

    /** Get the file name */
    const filename = headerContent
      .slice(headerContent.indexOf('"'))
      .replace(/^"(.+(?="$))"$/, "$1");

    /** Retrive data from the data stream */
    const reader = response.body.getReader();
    //return reader.read();
    return { reader, filename };
  });
}
