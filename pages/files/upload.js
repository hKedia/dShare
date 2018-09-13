import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Divider } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ipfs from "../../ethereum/ipfs";
import factory from "../../ethereum/factory";
import { getBytes32FromMultiash } from "../../lib/multihash";
import { createTimeStamp } from "../../utils/OriginStamp";
import { sha256 } from "../../utils/sha256";

class FileUpload extends Component {
  state = {
    buffer: "",
    ipfsHash: "",
    loading: false,
    fileName: ""
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

  createFile = async ipfsHash => {
    const { digest, hashFunction, size } = getBytes32FromMultiash(ipfsHash);
    console.log(`digest:${digest}  hashFunction:${hashFunction} size:${size}`);

    const accounts = await web3.eth.getAccounts();

    await factory.methods.createFile(digest, hashFunction, size).send({
      from: accounts[0]
    });

    this.setState({ loading: false });
  };

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    // get the sha256 hash of file
    const sha256hash = await sha256(this.state.buffer);
    console.log(sha256hash);

    // create timestamp
    const fileTimestamp = await createTimeStamp(sha256hash, "a@b.com");
    console.log(fileTimestamp.data);

    // uploading file to ipfs
    const data = {
      path: `/${this.state.fileName}`,
      content: this.state.buffer
    };

    await ipfs.files.add(data, (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(res);
      this.setState({ ipfsHash: res[0].hash }, () => {
        this.createFile(this.state.ipfsHash);
      });
    });
  };

  render() {
    return (
      <Layout>
        <h3>Upload File</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <Input type="file" onChange={this.captureFile} />
          </Form.Field>
          <Button primary loading={this.state.loading} type="submit">
            Upload to IPFS
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default FileUpload;
