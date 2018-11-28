import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import File from "../ethereum/fileInstance";
import factory from "../ethereum/factory";
import { toast } from "react-toastify";
import Router from "next/router";

/** Decribes the functionality for unsharing a previously shared file */

class StopSharing extends Component {
  state = {
    loading: false
  };

  /** Contains the login to stop sharing a file from a given recipient */

  stopSharing = async () => {
    this.setState({ loading: true });

    /** The File contract address */
    const fileInstance = File(this.props.address);

    /** Get all shared files for a user */
    const sharedFiles = await factory.methods
      .getSharedFiles()
      .call({ from: this.props.account });

    /** Get the index of file contract in the sharedFiles array */
    const indexFactoryOwner = sharedFiles.indexOf(this.props.address);

    /** Get the files for a given recipient */
    const recipientFiles = await factory.methods
      .getRecipientFiles()
      .call({ from: this.props.recipient });

    /** Get the index of file contract inthe recipientFiles array */
    const indexFactoryRecipient = recipientFiles.indexOf(this.props.address);

    /** Get the recipient list for the given file */
    const recipientsList = await fileInstance.methods
      .getRecipientsList()
      .call({ from: this.props.account });

    /** Get the index of the recipient from which sharing needs to be stopped */
    const indexFileRecipient = recipientsList.indexOf(this.props.recipient);

    try {
      /** Calls the stopSharing() in File contract with all the indexed of file contract
       * from where it needs to be deleted
       */
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
