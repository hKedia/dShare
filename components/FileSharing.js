import React, { Component } from "react";
import { Segment, Header, Form, Button, Input, Table } from "semantic-ui-react";
import db from "../utils/firebase";
import web3 from "../ethereum/web3";
import File from "../ethereum/fileInstance";
import {
  getMultihashFromBytes32,
  getBytes32FromMultiash
} from "../utils/multihash";
import ipfs from "../utils/ipfs";
import EthCrypto from "eth-crypto";
import Router from "next/router";
import StopSharing from "../components/StopSharing";
import { toast } from "react-toastify";

/** Describes the file sharing functionality for a file */

class FileSharing extends Component {
  state = {
    recipient: "",
    fileIpfsHash: "",
    fileEncryptedkey: "",
    userPrivateKey: "",
    keyIpfsHash: "",
    account: "",
    loading: false,
    recipientsList: []
  };

  /**
   * Getting the necessary file details when the component is loaded
   */

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    const fileInstance = File(this.props.address);

    this.setState({ account: accounts[0] });

    // get File's IPFS hash from Contract
    const returnedHash = await fileInstance.methods.getFileDetail().call({
      from: accounts[0]
    });

    const ipfsHash = {
      digest: returnedHash[0],
      hashFunction: returnedHash[1],
      size: returnedHash[2]
    };

    this.setState({ fileIpfsHash: getMultihashFromBytes32(ipfsHash) });

    // Retrive the encrypted key
    await ipfs.files.cat(
      `${this.state.fileIpfsHash}/${accounts[0]}`,
      (err, file) => {
        this.setState({ fileEncryptedkey: JSON.parse(file.toString("utf8")) });
      }
    );

    // Get the recipient List
    const recipientsList = await fileInstance.methods
      .getRecipientsList()
      .call({ from: accounts[0] });
    this.setState({ recipientsList });
  };

  /**
   * Encrypting the file's key using recipient's ethereum public key, uploading it to IPFS,
   * and sharing using smart contract
   */

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    //Get the recipient's public key
    const snapshot = await db
      .ref("/users/" + this.state.recipient.toLowerCase())
      .once("value");

    // Throw error, if recipient public key is not found
    if (snapshot.val() === null) {
      toast.error("The Recipient needs to signup before a file can be shared.");
      this.setState({ loading: false });
      return;
    }
    const recipientPublicKey = snapshot.val() && snapshot.val().public_key;

    // Decrypt the file key using user's private key
    let decryptedKey;
    try {
      decryptedKey = await EthCrypto.decryptWithPrivateKey(
        this.state.userPrivateKey,
        this.state.fileEncryptedkey
      );
    } catch (error) {
      toast.error("Invalid Private Key");
      this.setState({ loading: false });
      return;
    }

    // Encrypt the file key using recipient's public key
    const keyForSharing = await EthCrypto.encryptWithPublicKey(
      recipientPublicKey,
      Buffer.from(JSON.stringify(JSON.parse(decryptedKey)))
    );

    // Contruct the ipfs payload
    const ipfsPayload = [
      {
        path: `${this.state.recipient}`,
        content: Buffer.from(JSON.stringify(keyForSharing))
      }
    ];

    // uploading to ipfs
    await ipfs.files.add(ipfsPayload, (err, res) => {
      if (err) {
        return;
      }
      this.setState({ keyIpfsHash: res[0].hash }, () => {
        this.shareFile(this.state.keyIpfsHash);
      });
    });
  };

  /**
   * Calls the shareFile() in File Contract
   * @param {string} The IPFS hash of the encrypted key
   */

  shareFile = async keyIpfsHash => {
    const { digest, hashFunction, size } = getBytes32FromMultiash(keyIpfsHash);

    const fileInstance = File(this.props.address);

    /** Try to share file by calling shareFile().
     * If user rejects the transaction, then throw error
     */
    try {
      await fileInstance.methods
        .shareFile(this.state.recipient, digest, hashFunction, size)
        .send({ from: this.state.account });

      Router.push("/files/");
    } catch (error) {
      toast.error(error.message);
    }
    this.setState({ loading: false });
  };

  render() {
    let recipientsListComponent = null;
    /** If file is shared, then construct the component to show the recipients */
    if (this.state.recipientsList.length > 0) {
      const cells = this.state.recipientsList.map(recipient => {
        return (
          <StopSharing
            key={recipient}
            recipient={recipient}
            loading={this.state.loading}
            address={this.props.address}
            account={this.state.account}
          />
        );
      });
      recipientsListComponent = (
        <Table basic fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="2">File Shared With</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{cells}</Table.Body>
        </Table>
      );
    }
    return (
      <Segment>
        <Header size="tiny">Share file</Header>

        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <Input
              placeholder="Ethereum Address of Recipient"
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
              required
            />
          </Form.Field>

          <Form.Field>
            <Input
              placeholder="Your Private key"
              value={this.state.userPrivateKey}
              onChange={event =>
                this.setState({ userPrivateKey: event.target.value })
              }
              required
            />
          </Form.Field>

          <Button primary loading={this.state.loading} type="submit">
            Share
          </Button>
        </Form>
        {recipientsListComponent}
      </Segment>
    );
  }
}

export default FileSharing;
