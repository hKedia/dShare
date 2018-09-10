import React, { Component } from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";

class FileIndex extends Component {
  static async getInitialProps() {
    const files = await factory.methods.getDeployedFiles().call();

    return { files };
  }

  render() {
    console.log(this.props.files);
    return (
      <Layout>
        <h1>Index</h1>
      </Layout>
    );
  }
}

export default FileIndex;
