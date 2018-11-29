import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Grid } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import NoFilesFound from "../../components/NoFilesFound";
import RenderFiles from "../../components/RenderFiles";
import { Loader } from "semantic-ui-react";

/**
 * The component describes the default view when user logs in
 */

class FileIndex extends Component {
  state = {
    recipientFiles: [],
    uploadedFiles: [],
    loadingFiles: false
  };

  /**
   * Once the component is mounted, it retrives the recipient files, uploaded files and archives files from the contract
   */
  componentDidMount = async () => {
    this.setState({ loadingFiles: true });
    const accounts = await web3.eth.getAccounts();

    /** Get the shared files from factory contract */
    let recipientFiles = await factory.methods
      .getRecipientFiles()
      .call({ from: accounts[0] });

    /** Get the uploaded files from factory contract */
    let uploadedFiles = await factory.methods
      .getUploadedFiles()
      .call({ from: accounts[0] });

    /** Get the archieved files from the factory contract */
    const archivedFiles = await factory.methods
      .getArchivedFiles()
      .call({ from: accounts[0] });

    /** Filter the shared files from archived files */
    recipientFiles = recipientFiles.filter(item => {
      return !archivedFiles.includes(item);
    });

    /** Filter the uploaded files from archieved files */
    uploadedFiles = uploadedFiles.filter(item => {
      return !archivedFiles.includes(item);
    });

    this.setState({
      recipientFiles: recipientFiles,
      uploadedFiles: uploadedFiles,
      loadingFiles: false
    });
  };
  render() {
    let uploadedFiles, recipientFiles;
    /** If no files found, the display the NoFilesFound component */
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
