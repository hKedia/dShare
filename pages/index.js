import React, { Component } from "react";
import Layout from "../components/Layout";
import UploadedFileList from "../components/UploadedFileList";
import SharedFileList from "../components/SharedFileList";
import { Segment } from "semantic-ui-react";

class FileIndex extends Component {
  render() {
    return (
      <Layout>
        <Segment>
          <h3>Files Uploaded by me</h3>
          <UploadedFileList />
        </Segment>
        <Segment>
          <h3>Files Shared with me</h3>
          <SharedFileList />
        </Segment>
      </Layout>
    );
  }
}

export default FileIndex;
