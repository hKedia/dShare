import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import File from "../ethereum/fileInstance";
import factory from "../ethereum/factory";
import { toast } from "react-toastify";
import Router from "next/router";

class StopSharing extends Component {
  state = {
    loading: false
  };

  stopSharing = async () => {
    this.setState({ loading: true });
    console.log("Stop Sharing For", this.props.recipient);
    const fileInstance = File(this.props.address);

    const sharedFiles = await factory.methods
      .getSharedFiles()
      .call({ from: this.props.account });
    const indexFactoryOwner = sharedFiles.indexOf(this.props.address);
    console.log("Index Factory Owner", indexFactoryOwner);

    const recipientFiles = await factory.methods
      .getRecipientFiles()
      .call({ from: this.props.recipient });
    const indexFactoryRecipient = recipientFiles.indexOf(this.props.address);
    console.log("Index Factory Recipient", indexFactoryRecipient);

    const recipientsList = await fileInstance.methods
      .getRecipientsList()
      .call({ from: this.props.account });
    const indexFileRecipient = recipientsList.indexOf(this.props.recipient);
    console.log("Index File Recipient", indexFileRecipient);

    try {
      await fileInstance.methods
        .stopSharing(
          indexFactoryOwner,
          indexFactoryRecipient,
          indexFileRecipient,
          this.props.recipient
        )
        .send({ from: this.props.account });

      Router.push("/files/");
    } catch (error) {
      toast.error(error.message);
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.recipient}</Table.Cell>
        <Table.Cell textAlign="right">
          <Button
            loading={this.state.loading}
            basic
            color="red"
            onClick={this.stopSharing}
            disabled={this.props.loading}
          >
            Stop Sharing
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default StopSharing;
