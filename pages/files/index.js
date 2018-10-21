import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Grid } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import NoFilesFound from "../../components/NoFilesFound";
import RenderFiles from "../../components/RenderFiles";
import { Loader } from "semantic-ui-react";

class FileIndex extends Component {
  state = {
    recipientFiles: [],
    uploadedFiles: [],
    loadingFiles: false
  };
  componentDidMount = async () => {
    this.setState({ loadingFiles: true });
    const accounts = await web3.eth.getAccounts();

    const recipientFiles = await factory.methods
      .getRecipientFiles()
      .call({ from: accounts[0] });

    const uploadedFiles = await factory.methods
      .getUploadedFiles()
      .call({ from: accounts[0] });

    this.setState({
      recipientFiles: recipientFiles,
      uploadedFiles: uploadedFiles,
      loadingFiles: false
    });
  };
  render() {
    let uploadedFiles, recipientFiles;
    if (this.state.uploadedFiles.length === 0) {
      uploadedFiles = <NoFilesFound />;
    } else {
      uploadedFiles = (
        <RenderFiles files={this.state.uploadedFiles} isShared={0} />
      );
    }

    if (this.state.recipientFiles.length === 0) {
      recipientFiles = <NoFilesFound />;
    } else {
      recipientFiles = (
        <RenderFiles files={this.state.recipientFiles} isShared={1} />
      );
    }
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <h3>Files Uploaded by me</h3>
              {uploadedFiles}
              <Loader active={this.state.loadingFiles} inline="centered" />
            </Grid.Column>
            <Grid.Column width={8}>
              <h3>Files Shared with me</h3>
              {recipientFiles}
              <Loader active={this.state.loadingFiles} inline="centered" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default FileIndex;
