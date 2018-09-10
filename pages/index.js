import React, { Component } from "react";
import factory from "../ethereum/factory";

class FileIndex extends Component {
  static async getInitialProps() {
    const files = await factory.methods.getDeployedFiles().call();

    return { files };
  }

  render() {
    console.log(this.props.files);
    return <h1>Index Page</h1>;
  }
}

export default FileIndex;
