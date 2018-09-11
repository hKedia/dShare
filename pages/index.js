import React, { Component } from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import web3 from "../ethereum/web3";
import FileList from "../components/FileList";

class FileIndex extends Component {
  render() {
    return (
      <Layout>
        <h3>My Uploaded Files</h3>
        <FileList />
      </Layout>
    );
  }
}

export default FileIndex;
