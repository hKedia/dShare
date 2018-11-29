import React, { Component } from "react";
import web3 from "../ethereum/web3";
import ipfs from "../utils/ipfs";
import { Table, Button } from "semantic-ui-react";
import File from "../ethereum/fileInstance";
import { getMultihashFromBytes32 } from "../utils/multihash";
import Router from "next/router";
import factory from "../ethereum/factory";
import { toast } from "react-toastify";

/**
 * Describes the view to display file details such as file name, it's IPFS hash,
 * and contract address where it's deployed
 */

class FileDetail extends Component {
  state = {
    ipfsHash: "",
    fileName: "Loading...",
    account: "",
    loading: false,
    fileInstance: ""
  };

  /**
   * Getting the file's IPFS hash and the corresponding file name
   */

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    const fileInstance = File(this.props.address);
    let returnedHash;
    /** If uploaded file is viewed, then call the getFileDetail() */
    if (!this.props.isShared) {
      returnedHash = await fileInstance.methods.getFileDetail().call({
        from: accounts[0]
      });
      /** If shared file is viewed, then call the getSharedFileDetail() */
    } else {
      returnedHash = await fileInstance.methods.getSharedFileDetail().call({
        from: accounts[0]
      });
    }

    /** Combine the retrieved data to contruct the IPFS hash */
    const ipfsHash = {
      digest: returnedHash[0],
      hashFunction: returnedHash[1],
      size: returnedHash[2]
    };
    this.setState({
      ipfsHash: getMultihashFromBytes32(ipfsHash),
      account: accounts[0],
      fileInstance: fileInstance
    });

    /** Retrive the file name from IPFs */
    await ipfs.files.get(this.state.ipfsHash, (err, files) => {
      let fileName = files[2].path.split("/").pop();

      /** Update the local storage with deployed file's name */
      if (localStorage.getItem(this.props.address) === null) {
        localStorage.setItem(this.props.address, fileName);
      }

      this.setState({ fileName });
    });
  };

  /**
   * Archives a file by calling the archiveFile() in the File contract
   */

  archiveFile = async () => {
    this.setState({ loading: true });
    try {
      await this.state.fileInstance.methods
        .archiveFile()
        .send({ from: this.state.account });

      Router.push("/files/");
    } catch (error) {
      toast.error(error.message);
    }
    this.setState({ loading: false });
  };

  /** Restores a previously archived file */

  restoreFile = async () => {
    this.setState({ loading: true });
    const archivedFiles = await factory.methods
      .getArchivedFiles()
      .call({ from: this.state.account });
    const index = archivedFiles.indexOf(this.props.address);

    /** Try to call the restoreFile(). If user reject transaction, throw error */
    try {
      await this.state.fileInstance.methods
        .restoreFile(index)
        .send({ from: this.state.account });

      Router.push("/files/");
    } catch (error) {
      toast.error(error.message);
    }

    this.setState({ loading: false });
  };

  render() {
    let archiveComponent;
    if (this.props.isArchived && !this.props.isShared) {
      archiveComponent = (
        <Button
          onClick={this.restoreFile}
          color="blue"
          loading={this.state.loading}
        >
          Restore
        </Button>
      );
    }
    if (!this.props.isArchived && !this.props.isShared) {
      archiveComponent = (
        <Button
          onClick={this.archiveFile}
          color="red"
          loading={this.state.loading}
        >
          Archive
        </Button>
      );
    }
    return (
      <Table striped fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>File Details</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">
              {archiveComponent}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell textAlign="right">{this.state.fileName}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>Deployed at</Table.Cell>
            <Table.Cell textAlign="right">{this.props.address}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>IPFS Hash</Table.Cell>
            <Table.Cell textAlign="right">
              <a
                href={"https://gateway.ipfs.io/ipfs/" + this.state.ipfsHash}
                target="_blank"
              >
                {this.state.ipfsHash}
              </a>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default FileDetail;
