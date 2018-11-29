import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import Link from "next/link";

/**
 * Decribes the view to list all uploaded and shared files
 */

class RenderFiles extends Component {
  render() {
    const items = this.props.files.map(address => {
      return {
        /** Check the local storage for filename, if not, then show the contract address for the file */
        header: localStorage.getItem(address) || address,
        description: (
          <Link
            href={{
              pathname: "/files/view",
              query: {
                fileContract: address,
                isShared: this.props.isShared,
                isArchived: this.props.isArchived
              }
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
}

export default RenderFiles;
