import React, { Component } from "react";
import Layout from "../../components/Layout";
import FileDetail from "../../components/FileDetail";
import FileTimestampDetail from "../../components/FileTimestampDetail";
import FileSharing from "../../components/FileSharing";
import FileDownload from "../../components/FileDownload";

/**
 * Describes the view when user's views a particular file
 */

class FileView extends Component {
  static async getInitialProps(props) {
    const fileContract = props.query.fileContract;
    const isShared = Number(props.query.isShared);
    const isArchived = Number(props.query.isArchived);
    return { fileContract, isShared, isArchived };
  }
  render() {
    let fileSharingComponent = null;
    if (!this.props.isShared && !this.props.isArchived) {
      fileSharingComponent = <FileSharing address={this.props.fileContract} />;
    }
    return (
      <Layout>
        <FileDetail
          address={this.props.fileContract}
          isShared={this.props.isShared}
          isArchived={this.props.isArchived}
        />

        <FileTimestampDetail address={this.props.fileContract} />

        <FileDownload
          address={this.props.fileContract}
          shared={this.props.isShared}
        />

        {fileSharingComponent}
      </Layout>
    );
  }
}

export default FileView;
