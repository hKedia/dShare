import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Segment, Header } from "semantic-ui-react";
import { sha256 } from "../../utils/sha256";
import { getTimestampProof } from "../../utils/OriginStamp";
import { toast } from "react-toastify";

const FileSaver = require("file-saver");

class TimestampProof extends Component {
  state = {
    buffer: "",
    loading: false,
    message: ""
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

    this.setState({ loading: true });

    const filehash = await sha256(this.state.buffer);
    console.log("filehash", filehash);

    const proof = await getTimestampProof(filehash);
    if (typeof proof === "object") {
      FileSaver.saveAs(proof);
    } else {
      toast.error(proof);
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Segment>
          <Header>Submit the file to download the timestamp proof</Header>
          <Form onSubmit={this.onSubmit}>
            <Form.Field>
              <Input type="file" onChange={this.captureFile} />
            </Form.Field>
            <Button primary loading={this.state.loading} type="submit">
              Download Proof
            </Button>
          </Form>
        </Segment>
      </Layout>
    );
  }
}

export default TimestampProof;
