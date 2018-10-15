import React, { Component } from "react";
import Layout from "../components/Layout";
import UploadedFileList from "../components/UploadedFileList";
import SharedFileList from "../components/SharedFileList";
import { Grid } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { updateInterface } from "../utils/updateInterface";

if (web3.currentProvider.publicConfigStore !== undefined) {
  web3.currentProvider.publicConfigStore.on(
    "update",
    ({ selectedAddress, networkVersion }) => {
      updateInterface(selectedAddress, networkVersion);
    }
  );
}

class FileIndex extends Component {
  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <h3>Files Uploaded by me</h3>
              <UploadedFileList />
            </Grid.Column>
            <Grid.Column width={8}>
              <h3>Files Shared with me</h3>
              <SharedFileList />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default FileIndex;
