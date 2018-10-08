import { Card } from "semantic-ui-react";
import Link from "next/link";

export function renderFiles(files) {
  const items = files.map(address => {
    return {
      header: address,
      description: (
        <Link
          href={{
            pathname: "/files/view",
            query: { fileContract: address, isShared: 0 }
          }}
        >
          <a>View File</a>
        </Link>
      ),
      fluid: true,
      key: address
    };
  });
  return <Card.Group items={items} />;
}

export function renderSharedFiles(files) {
  const items = files.map(address => {
    return {
      header: address,
      description: (
        <Link
          href={{
            pathname: "/files/view",
            query: { fileContract: address, isShared: 1 }
          }}
        >
          <a>View File</a>
        </Link>
      ),
      fluid: true,
      key: address
    };
  });
  return <Card.Group items={items} />;
}
