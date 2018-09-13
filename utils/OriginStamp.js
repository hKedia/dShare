import { originStampApiKey } from "./OriginStampApiKey";

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
