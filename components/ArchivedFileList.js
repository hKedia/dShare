import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import RenderFiles from "./RenderFiles";
import NoFilesFound from "./NoFilesFound";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";

class ArchivedFileList extends Component {
  state = {
    loadingFiles: false,
    archivedFiles: []
  };

  componentDidMount = async () => {
    this.setState({ loadingFiles: true });
    const accounts = await web3.eth.getAccounts();
    const archivedFiles = await factory.methods
      .getArchivedFiles()
      .call({ from: accounts[0] });
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
