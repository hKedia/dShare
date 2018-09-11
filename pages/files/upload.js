import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Divider } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ipfs from "../../ethereum/ipfs";
import factory from "../../ethereum/factory";
import { getBytes32FromMultiash } from "../../lib/multihash";

class FileUpload extends Component {
  state = {
    buffer: "",
    ipfsHash: null,
    loading: false
  };

  captureFile = event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
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

  onSubmit = async event => {
    event.preventDefault();
    try {
      this.setState({ loading: true });
      const accounts = await web3.eth.getAccounts();

      // uploading file to ipfs
      await ipfs.files.add(this.state.buffer, (err, ipfsHash) => {
        console.log(err, ipfsHash);
        this.setState({ ipfsHash: ipfsHash[0].hash });
      });

      const { digest, hashFunction, size } = getBytes32FromMultiash(
        this.state.ipfsHash
      );

      console.log(digest, hashFunction, size);

      await factory.methods.createFile(digest, hashFunction, size).send({
        from: accounts[0]
      });
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
    }
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
