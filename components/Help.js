import React, { Component } from "react";
import { Segment } from "semantic-ui-react";

class Help extends Component {
  render() {
    const pathname = this.props.pathname;
    const path = pathname.slice(pathname.lastIndexOf("/"));
    let content;
    switch (path) {
      case "/":
        content = (
          <Segment basic size="big">
            <p>
              This page lists the files uploaded by you as well as the files
              which are shared with you by other users.
            </p>
          </Segment>
        );
        break;

      case "/sharedFiles":
        content = <p>Content for Shared Files</p>;
        break;

      case "/archivedFiles":
        content = <p>Content for Archived Files</p>;
        break;

      case "/proof":
        content = <p>Content for Proof</p>;
        break;

      case "/upload":
        content = <p>Content for Upload</p>;
        break;

      case "/view":
        content = <p>Content for File View page</p>;
        break;

      default:
        content = <p>No help page found</p>;
    }
    return <div>{content}</div>;
  }
}

export default Help;
