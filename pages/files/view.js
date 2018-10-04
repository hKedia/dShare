import React, { Component } from "react";
import Layout from "../../components/Layout";
import FileDetail from "../../components/FileDetail";
import FileTimestampDetail from "../../components/FileTimestampDetail";
import FileSharing from "../../components/FileSharing";

class FileView extends Component {
  static async getInitialProps(props) {
    const fileContract = props.query.fileContract;
    return { fileContract };
  }
  render() {
    return (
      <Layout>
        <FileDetail address={this.props.fileContract} />
        <FileTimestampDetail address={this.props.fileContract} />
        <FileSharing address={this.props.fileContract} />
      </Layout>
    );
  }
}

export default FileView;
