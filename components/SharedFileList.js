import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import factory from "../ethereum/factory";
import web3 from "../ethereum/web3";
import { renderSharedFiles } from "./renderFiles";
import NoFilesFound from "./NoFilesFound";

class SharedFileList extends Component {
  state = {
    loadingFiles: false,
    files: []
  };

  componentDidMount = async () => {
    this.setState({ loadingFiles: true });
    const accounts = await web3.eth.getAccounts();
    const files = await factory.methods
      .getSharedFiles()
      .call({ from: accounts[0] });
    this.setState({ files: files, loadingFiles: false });
  };

  render() {
    return (
      <div>
        {renderSharedFiles(this.state.files)}
        <Loader active={this.state.loadingFiles} inline="centered" />
        <NoFilesFound hidden={!!this.state.files.length} />
      </div>
    );
  }
}

export default SharedFileList;
