import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Segment, Header } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ipfs from "../../utils/ipfs";
import factory from "../../ethereum/factory";
import { getBytes32FromMultiash } from "../../utils/multihash";
import { createTimeStamp } from "../../utils/OriginStamp";
import { sha256 } from "../../utils/sha256";
import { encrypt } from "../../utils/crypto";
import Router from "next/router";
import EthCrypto from "eth-crypto";
import db from "../../utils/firebase";
import { toast } from "react-toastify";

/**
 * Describes the view for handling file upload
 */

class FileUpload extends Component {
  state = {
    buffer: "",
    fileIpfsHash: "",
    loading: false,
    fileName: "",
    email: "",
    account: ""
  };

  /**
   * Captures the file submitted by the user
   * @param {object} event The file capture event
   */

  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ fileName: file.name });
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.convertToBuffer(reader);
    };
  };

  /**
   * Converts the captured file into buffer and updates the state variable
   * @param {object} reader The reader as passed from captureFile()
   */

  convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  /**
   * Converts the IPFS hash into multihash format and submits it to the contract
   * @param {string} fileIpfsHash The IPFS hash of the uploaded file
   * @param {string} sha256hash The sha3 hash of the file
   */

  createFile = async (fileIpfsHash, sha256hash) => {
    const { digest, hashFunction, size } = getBytes32FromMultiash(fileIpfsHash);

    try {
      await factory.methods
        .createFile(digest, hashFunction, size, "0x" + sha256hash)
        .send({
          from: this.state.account
        });
      Router.push("/files/");
    } catch (error) {
      toast.error(error.message);
    }
    this.setState({ loading: false });
  };

  /**
   * Getting file's hash and submitting to the OriginStamp API, encrypting the file and uploading to IPFS
   * @param {object} event The submit event
   */

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    // get default account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // get the sha256 hash of file
    const sha256hash = await sha256(this.state.buffer);

    // create timestamp
    try {
      await createTimeStamp(sha256hash, this.state.email);
    } catch (error) {
      toast.error("Error in creating timestamp");
      return;
    }

    // encrypt the file
    const { data, iv, key } = await encrypt(this.state.buffer);
    const dataArray = new Uint8Array(data);

    //combine the data and random value
    const data_iv = new Uint8Array([...dataArray, ...iv]);

    //encryption key in JSON
    const keyData = await window.crypto.subtle.exportKey("jwk", key);

    // getting the public key
    const snapshot = await db
      .ref("/users/" + this.state.account.toLowerCase())
      .once("value");
    const publicKey = snapshot.val() && snapshot.val().public_key;

    //encrypt the document key with user's ethereum public key
    const encryptedKey = await EthCrypto.encryptWithPublicKey(
      publicKey,
      Buffer.from(JSON.stringify(keyData))
    );

    //Contruct the data to be uploaded to ipfs
    const ipfsPayload = [
      {
        path: `/tmp/${this.state.fileName}`,
        content: Buffer.from(data_iv)
      },
      {
        path: `/tmp/${this.state.account}`,
        content: Buffer.from(JSON.stringify(encryptedKey))
      }
    ];

    // uploading file to ipfs
    await ipfs.files.add(ipfsPayload, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      this.setState({ fileIpfsHash: res[2].hash }, () => {
        this.createFile(this.state.fileIpfsHash, sha256hash); // save the hash of directory in contract
      });
    });
  };

  render() {
    return (
      <Layout>
        <Segment>
          <Header>Upload File</Header>
          <Form onSubmit={this.onSubmit}>
            <Form.Group widths="equal">
              <Form.Field>
                <Input type="file" onChange={this.captureFile} required />
              </Form.Field>
              <Form.Field>
                <Input
                  type="email"
                  label="@"
                  placeholder="Emaild id to receive the timestamp details"
                  value={this.state.email}
                  onChange={event =>
                    this.setState({ email: event.target.value })
                  }
                  required
                />
              </Form.Field>
            </Form.Group>
            <Button primary loading={this.state.loading} type="submit">
              Upload to IPFS
            </Button>
          </Form>
        </Segment>
      </Layout>
    );
  }
}

export default FileUpload;
