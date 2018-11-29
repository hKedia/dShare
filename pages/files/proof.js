import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Segment, Header } from "semantic-ui-react";
import { sha256 } from "../../utils/sha256";
import { getTimestampProof } from "../../utils/OriginStamp";
import { toast } from "react-toastify";

const FileSaver = require("file-saver");

/**
 * Describes the view where user can get timestamp proof for a given document
 */

class TimestampProof extends Component {
  state = {
    buffer: "",
    loading: false,
    message: ""
  };

  /**
   * Captures the file submitted by user
   * @param {object} event The file capture event
   */

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

  /**
   * Converts the captured file into buffer and updates the state variable
   * @param {object} reader The reader as passed from captureFile()
   */

  convertToBuffer = async reader => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  /**
   * Get's the file's hash and submits it to the OriginStamp API to get the proof
   * @param {object} event The submit event
   */

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    /** Get the sha256 hash of the file */
    const filehash = await sha256(this.state.buffer);

    /** Retreive the timestamp proof of the hash using the OriginStamp API */
    const proof = await getTimestampProof(filehash);

    if (proof === undefined) {
      toast.error("No proof found for the submitted file");
    } else {
    /** If proof exists, then download it to the disk */
      const { reader, filename } = proof;
      const data = await reader.read();
      const file = new File([data.value], filename);
      FileSaver.saveAs(file);
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
              <Input type="file" onChange={this.captureFile} required />
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
