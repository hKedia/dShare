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
    console.log("Recipients List", recipientsList);
    this.setState({ recipientsList });
  };

  onSubmit = async event => {
    event.preventDefault();
    console.log("recipient", this.state.recipient);

    this.setState({ loading: true });

    //Get the recipient's public key
    const snapshot = await db
      .ref("/users/" + this.state.recipient.toLowerCase())
      .once("value");
    const recipientPublicKey = snapshot.val() && snapshot.val().public_key;
    console.log("recipientPublicKey", recipientPublicKey);
    console.log("fileEncryptedkey", this.state.fileEncryptedkey);

    // Decrypt the file key using user's private key
    const decryptedKey = await EthCrypto.decryptWithPrivateKey(
      this.state.userPrivateKey,
      this.state.fileEncryptedkey
    );
    console.log("decryptedKey", JSON.parse(decryptedKey));

    // Encrypt the file key using recipient's public key
    const keyForSharing = await EthCrypto.encryptWithPublicKey(
      recipientPublicKey,
      Buffer.from(JSON.stringify(JSON.parse(decryptedKey)))
    );
    console.log("Encrypted key for sharing", keyForSharing);

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
        console.log(err);
        return;
      }
      console.log("ipfs result", res);
      this.setState({ keyIpfsHash: res[0].hash }, () => {
        this.shareFile(this.state.keyIpfsHash);
      });
    });
  };

  shareFile = async keyIpfsHash => {
    const { digest, hashFunction, size } = getBytes32FromMultiash(keyIpfsHash);
    console.log(`digest:${digest}  hashFunction:${hashFunction} size:${size}`);

    const fileInstance = File(this.props.address);

    await fileInstance.methods
      .shareFile(this.state.recipient, digest, hashFunction, size)
      .send({ from: this.state.account });

    Router.push("/files/");
    this.setState({ loading: false });
  };

  render() {
    let recipientsListComponent = null;
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
            />
          </Form.Field>

          <Form.Field>
            <Input
              placeholder="Your Private key"
              value={this.state.userPrivateKey}
              onChange={event =>
                this.setState({ userPrivateKey: event.target.value })
              }
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
