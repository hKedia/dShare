import React, { Component } from "react";
import Layout from "../components/Layout";
import UploadedFileList from "../components/UploadedFileList";
import SharedFileList from "../components/SharedFileList";
import { Segment, Grid } from "semantic-ui-react";

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
