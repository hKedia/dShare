import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Icon } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ipfs from "../../ethereum/ipfs";
import factory from "../../ethereum/factory";
import { getBytes32FromMultiash } from "../../lib/multihash";
import { createTimeStamp } from "../../utils/OriginStamp";
import { sha256 } from "../../utils/sha256";
import { encrypt } from "../../components/crypto";
import Router from "next/router";

class FileUpload extends Component {
  state = {
    buffer: "",
    fileIpfsHash: "",
    loading: false,
    fileName: "",
    email: "",
    account: ""
  };

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

  convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  createFile = async fileIpfsHash => {
    const { digest, hashFunction, size } = getBytes32FromMultiash(fileIpfsHash);
    console.log(`digest:${digest}  hashFunction:${hashFunction} size:${size}`);

    await factory.methods.createFile(digest, hashFunction, size).send({
      from: this.state.account
    });

    this.setState({ loading: false });
    Router.push("/");
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    // get default account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    console.log("account", this.state.account);

    // get the sha256 hash of file
    const sha256hash = await sha256(this.state.buffer);
    console.log("sha256hash", sha256hash);

    // create timestamp
    const fileTimestamp = await createTimeStamp(sha256hash, this.state.email);
    console.log("email", this.state.email);
    console.log("timestamp", fileTimestamp.data);

    // encrypt the file
    const { data, iv, key } = await encrypt(this.state.buffer);
    const dataArray = new Uint8Array(data);
    console.log(dataArray);

    //combine the data and random value
    const data_iv = new Uint8Array([...dataArray, ...iv]);

    //encryption key in JSON
    const keyData = await window.crypto.subtle.exportKey("jwk", key);
    console.log(keyData);

    //Contruct the data to be uploaded to ipfs
    const ipfsPayload = [
      {
        path: `/tmp/${this.state.fileName}`,
        content: Buffer.from(data_iv)
      },
      {
        path: `/tmp/${this.state.account}`,
        content: Buffer.from(JSON.stringify(keyData))
      }
    ];

    // uploading file to ipfs
    await ipfs.files.add(ipfsPayload, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(res);
      this.setState({ fileIpfsHash: res[2].hash }, () => {
        this.createFile(this.state.fileIpfsHash); // save the hash of directory in contract
      });
    });
  };

  render() {
    return (
      <Layout>
        <h3>Upload File</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Group widths="equal">
            <Form.Field>
              <Input type="file" onChange={this.captureFile} />
            </Form.Field>
            <Form.Field>
              <Input
                type="text"
                label="@"
                placeholder="Emaild id to receive the timestamp details"
                value={this.state.email}
                onChange={event => this.setState({ email: event.target.value })}
              />
            </Form.Field>
          </Form.Group>
          <Button primary loading={this.state.loading} type="submit">
            Upload to IPFS
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default FileUpload;
