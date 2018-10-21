import { originStampApiKey } from "./OriginStampApiKey";

const fileType = require("file-type");

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
      Authorization: originStampApiKey()
    },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json();
  });
}

export function timestampStatus(hash) {
  return fetch(`https://api.originstamp.com/v3/timestamp/${hash}`, {
    method: "GET",
    headers: {
      Authorization: originStampApiKey()
    }
  }).then(response => {
    return response.json();
  });
}

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
      Authorization: originStampApiKey()
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      const reader = response.body.getReader();
      return reader.read();
    })
    .then(data => {
      const type = fileType(data.value);
      if (type === null) {
        return "There is no proof for the submitted file.";
      }

      const file = new File([data.value], "proof.xml", { type: type.mime });
      return file;
    });
}
