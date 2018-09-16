import { Card } from "semantic-ui-react";
import Link from "next/link";

export function renderFiles(files) {
  const items = files.map(address => {
    return {
      header: address,
      description: (
        <Link
          href={{ pathname: "/files/view", query: { fileContract: address } }}
        >
          <a>View File</a>
        </Link>
      ),
      fluid: true
    };
  });
  return <Card.Group items={items} />;
}
