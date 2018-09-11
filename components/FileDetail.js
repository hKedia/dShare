import React, { Component } from "react";
import web3 from "../ethereum/web3";
import ipfs from "../ethereum/ipfs";
import { Table } from "semantic-ui-react";
import File from "../ethereum/fileInstance";

class FileDetail extends Component {
  getFile() {
    const accounts = web3.eth.getAccounts();
  }
  render() {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">File Details</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Name</Table.Cell>
            <Table.Cell />
          </Table.Row>

          <Table.Row>
            <Table.Cell>Deployed at</Table.Cell>
            <Table.Cell>{this.props.address}</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.Cell>IPFS Hash</Table.Cell>
            <Table.Cell>{this.getFile()}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default FileDetail;
