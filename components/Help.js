import React, { Component } from "react";
import { Segment } from "semantic-ui-react";
import Router from "next/router";

class Help extends Component {
  render() {
    const pathname = Router.pathname;
    const path = pathname.slice(pathname.lastIndexOf("/"));
    let content;
    switch (path) {
      case "/":
        content = (
          <Segment basic size="big">
            <p>
              This page lists the files. On the left column you see the files
              uploaded by you and on the right column you see the files shared
              with you by others.
            </p>

            <p>
              Initially, the UI shows the contract address of the deployed file
              but as a file is viewed, the file name is fetched and saved in the
              local storage.
            </p>

            <p>
              You can use the top menu panel to navigate to different parts of
              the application.
            </p>

            <p>
              The bottom panel shows the current Ethereum account and the
              network the application is connected to.
            </p>
          </Segment>
        );
        break;

      case "/sharedFiles":
        content = (
          <Segment basic size="big">
            <p>
              This page shows the files which you have shared with other users.
            </p>
          </Segment>
        );
        break;

      case "/archivedFiles":
        content = (
          <Segment basic size="big">
            <p>This page shows the archived files.</p>
          </Segment>
        );
        break;

      case "/proof":
        content = (
          <Segment basic size="big">
            <p>
              This page can be used to download the timestamping proof for any
              file.
            </p>
          </Segment>
        );
        break;

      case "/upload":
        content = (
          <Segment basic size="big">
            <p>Here you can upload your file to the IPFS network.</p>
          </Segment>
        );
        break;

      case "/view":
        content = (
          <Segment basic size="big">
            <p>This page shows all the details for a file.</p>
          </Segment>
        );
        break;

      default:
        content = <p>No help page found</p>;
    }
    return <div>{content}</div>;
  }
}

export default Help;
