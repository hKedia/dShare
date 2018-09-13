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
    loading: false,
    sha256hash: null
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
    console.log(this.state.buffer);
    this.generateSHA256Digest();
  };

  convertArrayBufferToHexaDecimal = buffer => {
    var data_view = new DataView(buffer);
    var iii,
      len,
      hex = "",
      c;

    for (iii = 0, len = data_view.byteLength; iii < len; iii += 1) {
      c = data_view.getUint8(iii).toString(16);
      if (c.length < 2) {
        c = "0" + c;
      }

      hex += c;
    }

    return hex;
  };

  generateSHA256Digest = () => {
    window.crypto.subtle
      .digest(
        {
          name: "SHA-256"
        },
        this.state.buffer //The data you want to hash as an ArrayBuffer
      )
      .then(hash =>
        this.setState({
          sha256hash: this.convertArrayBufferToHexaDecimal(hash)
        })
      )
      .catch(function(err) {
        console.error(err);
      });
    console.log("SHA-256 Hash" + this.state.sha256hash);
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
