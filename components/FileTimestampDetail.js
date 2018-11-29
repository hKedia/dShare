import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import File from "../ethereum/fileInstance";
import web3 from "../ethereum/web3";
import { timestampStatus, getStatusMessage } from "../utils/OriginStamp";

/** Describes the view for showing timestamping details for the file */

class FileTimestampDetail extends Component {
  state = {
    sha3hash: "",
    message: "",
    transaction: "",
    timestamp: ""
  };

  /** Gets the file's sha3 hash from the contract and submits it
   * to the OriginStamp API to get the timestamping details
   */

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    const fileInstance = File(this.props.address);
    const returnedHash = await fileInstance.methods.getFileSha3Hash().call({
      from: accounts[0]
    });
    this.setState({ sha3hash: returnedHash.slice(2) });

    /** Retrieve the timestamp details using the OriginStamp API */
    const returnedData = await timestampStatus(this.state.sha3hash);
    const timestamp = returnedData.data.timestamps[0];

    this.setState({
      message: getStatusMessage(timestamp.submit_status),
      transaction: timestamp.transaction
    });

    if (timestamp.timestamp) {
      const date = new Date(timestamp.timestamp);
      this.setState({ timestamp: date.toUTCString() });
    }
  };

  render() {
    return (
      <Table striped fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="2">Timestamp Details</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>Status</Table.Cell>
            <Table.Cell textAlign="right">{this.state.message}</Table.Cell>
          </Table.Row>

          <Table.Row hidden={!this.state.transaction}>
            <Table.Cell>Transaction Hash</Table.Cell>
            <Table.Cell textAlign="right">
              <a
                href={
                  "https://www.blockchain.com/btc/tx/" + this.state.transaction
                }
                target="_blank"
              >
                {this.state.transaction}
              </a>
            </Table.Cell>
          </Table.Row>

          <Table.Row hidden={!this.state.timestamp}>
            <Table.Cell>Timestamp</Table.Cell>
            <Table.Cell textAlign="right">{this.state.timestamp}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default FileTimestampDetail;
