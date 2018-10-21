import React, { Component } from "react";
import Layout from "../../components/Layout";
import FileDetail from "../../components/FileDetail";
import FileTimestampDetail from "../../components/FileTimestampDetail";
import FileSharing from "../../components/FileSharing";
import { Segment } from "semantic-ui-react";
import FileDownload from "../../components/FileDownload";

class FileView extends Component {
  static async getInitialProps(props) {
    const fileContract = props.query.fileContract;
    const isShared = Number(props.query.isShared);
    const isArchived = Number(props.query.isArchived);
    return { fileContract, isShared, isArchived };
  }
  render() {
    let fileSharingComponent = null;
    if (!this.props.isShared) {
      fileSharingComponent = <FileSharing address={this.props.fileContract} />;
    }
    return (
      <Layout>
        <FileDetail
          address={this.props.fileContract}
          shared={this.props.isShared}
          archived={this.props.isArchived}
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
