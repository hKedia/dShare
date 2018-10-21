import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import RenderFiles from "./RenderFiles";
import NoFilesFound from "./NoFilesFound";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";

class SharedFileList extends Component {
  state = {
    loadingFiles: false,
    sharedFiles: []
  };

  componentDidMount = async () => {
    this.setState({ loadingFiles: true });
    const accounts = await web3.eth.getAccounts();
    const files = await factory.methods
      .getSharedFiles()
      .call({ from: accounts[0] });
    const sharedFiles = this.arrayUnique(files);
    console.log("Shared - Archived Files:", sharedFiles);
    this.setState({ sharedFiles: sharedFiles, loadingFiles: false });
  };

  arrayUnique = arr => {
    return arr.filter(function(item, index) {
      return arr.indexOf(item) >= index;
    });
  };

  render() {
    let sharedFiles;
    if (this.state.sharedFiles.length === 0) {
      sharedFiles = <NoFilesFound />;
    } else {
      sharedFiles = <RenderFiles files={this.state.sharedFiles} isShared={0} />;
    }
    return (
      <div>
        {sharedFiles}
        <Loader active={this.state.loadingFiles} inline="centered" />
      </div>
    );
  }
}

export default SharedFileList;
