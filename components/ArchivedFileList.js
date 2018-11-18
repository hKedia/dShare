import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import RenderFiles from "./RenderFiles";
import NoFilesFound from "./NoFilesFound";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";

/**
 * Component describes the view for files archived by a user
 */

class ArchivedFileList extends Component {
  state = {
    loadingFiles: false,
    archivedFiles: []
  };

  /**
   * Getting the uploaded and archived files list when components mounts.
   */

  componentDidMount = async () => {
    this.setState({ loadingFiles: true });
    const accounts = await web3.eth.getAccounts();
    let archivedFiles = await factory.methods
      .getArchivedFiles()
      .call({ from: accounts[0] });

    const uploadedFiles = await factory.methods
      .getUploadedFiles()
      .call({ from: accounts[0] });

    /** Filtering the files such that only files archived the current user is shown */
    archivedFiles = uploadedFiles.filter(item => {
      return archivedFiles.includes(item);
    });

    console.log("Archived Files:", archivedFiles);
    this.setState({ archivedFiles: archivedFiles, loadingFiles: false });
  };

  render() {
    let archivedFiles;
    if (this.state.archivedFiles.length === 0) {
      archivedFiles = <NoFilesFound />;
    } else {
      archivedFiles = (
        <RenderFiles files={this.state.archivedFiles} isArchived={1} />
      );
    }
    return (
      <div>
        {archivedFiles}
        <Loader active={this.state.loadingFiles} inline="centered" />
      </div>
    );
  }
}

export default ArchivedFileList;
