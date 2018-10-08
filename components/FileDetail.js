import React, { Component } from "react";
import web3 from "../ethereum/web3";
import ipfs from "../ethereum/ipfs";
import { Table } from "semantic-ui-react";
import File from "../ethereum/fileInstance";
import { getMultihashFromBytes32 } from "../lib/multihash";

class FileDetail extends Component {
  state = {
    ipfsHash: "",
    fileName: ""
  };

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    const fileInstance = File(this.props.address);
    let returnedHash;
    if (!this.props.shared) {
      returnedHash = await fileInstance.methods.getFileDetail().call({
        from: accounts[0]
      });
    } else {
      returnedHash = await fileInstance.methods.getSharedFileDetail().call({
        from: accounts[0]
      });
    }

    const ipfsHash = {
      digest: returnedHash[0],
      hashFunction: returnedHash[1],
      size: returnedHash[2]
    };

    console.log("ipfs", ipfsHash);
    this.setState({ ipfsHash: getMultihashFromBytes32(ipfsHash) });

    await ipfs.files.get(this.state.ipfsHash, (err, files) => {
      this.setState({ fileName: files[2].path.split("/").pop() });
    });
  };

  render() {
    return (
      <Table celled striped fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">File Details</Table.HeaderCell>
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
              <a href={"https://gateway.ipfs.io/ipfs/" + this.state.ipfsHash}>
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
