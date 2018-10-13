import React from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

export default () => {
  return (
    <Menu style={{ marginTop: "10px" }}>
      <Link href="/main">
        <a className="item">Home</a>
      </Link>

      <Link href="/files/sharedFiles">
        <a className="item">View Shared Files</a>
      </Link>

      <Menu.Menu position="right">
        <Link href="/files/proof">
          <a className="item">Download Timestamp Proof</a>
        </Link>

        <Link href="/files/upload">
          <a className="item">Upload Files</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};
