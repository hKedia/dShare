import React, { Component } from "react";
import { Segment, Header, Input, Button, Form } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import ipfs from "../utils/ipfs";
import FileInstance from "../ethereum/fileInstance";
import { getMultihashFromBytes32 } from "../utils/multihash";
import EthCrypto from "eth-crypto";
import { decrypt } from "../utils/crypto";
import { toast } from "react-toastify";

const FileSaver = require("file-saver");

/**
 * This component enables the user to download a file by providing their private key,
 * which is used to decrypt the file's key
 */

class FileDownload extends Component {
  state = {
    userPrivateKey: "",
    loading: false,
    fileIpfsPath: "",
    keyIpfsPath: "",
    fileName: "",
    encryptedKey: {}
  };

  /** Retrives the file's IPFS hash and key */

  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
    const fileInstance = FileInstance(this.props.address);

    let returnedHash;
    let fileHash;
    let keyHash;
    /** Depending on whether the viewed file is a uploaded or shared one,
     * call the respective function from file contract to retrieve file details */
    if (!this.props.shared) {
      returnedHash = await fileInstance.methods.getFileDetail().call({
        from: accounts[0]
      });

      /** Convert the retrived hash to multihash format */
      fileHash = getMultihashFromBytes32({
        digest: returnedHash[0],
        hashFunction: returnedHash[1],
        size: returnedHash[2]
      });

      this.setState({
        fileIpfsPath: fileHash,
        keyIpfsPath: `${fileHash}/${accounts[0]}`
      });
    } else {
      returnedHash = await fileInstance.methods.getSharedFileDetail().call({
        from: accounts[0]
      });

      /** IPFS hash of the file */
      fileHash = getMultihashFromBytes32({
        digest: returnedHash[0],
        hashFunction: returnedHash[1],
        size: returnedHash[2]
      });

      /** IPFS hash of the respective key */
      keyHash = getMultihashFromBytes32({
        digest: returnedHash[3],
        hashFunction: returnedHash[4],
        size: returnedHash[5]
      });

      this.setState({ fileIpfsPath: fileHash, keyIpfsPath: keyHash });
    }

    this.setState({ account: accounts[0] });

    /** Retrieve the File Name */
    await ipfs.files.get(this.state.fileIpfsPath, (err, files) => {
      if (err) {
        throw err;
      }
      this.setState({
        fileName: files[2].path.split("/").pop(),
        fileContent: files[2].content
      });
    });

    /** Retrive the encrypted key */
    await ipfs.files.cat(this.state.keyIpfsPath, (err, file) => {
      if (err) {
        throw err;
      }
      this.setState({ encryptedKey: JSON.parse(file.toString("utf8")) });
    });
  };

  /**
   * It decrypts the key which is used to decrypt the file and downloads it
   */

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true });

    /** Decrypt the key using user's private key */
    let decryptedKey;
    try {
      decryptedKey = await EthCrypto.decryptWithPrivateKey(
        this.state.userPrivateKey,
        this.state.encryptedKey
      );
    } catch (error) {
      toast.error("Invalid Private Key");
      this.setState({ loading: false });
      return;
    }

    /** Convert key into valid jwk format */
    const key = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(decryptedKey),
      "AES-GCM",
      true,
      ["encrypt", "decrypt"]
    );

    const fileContent = this.state.fileContent;

    // Retrieve the original file Content
    const fileBuffer = fileContent.slice(0, fileContent.length - 12);

    // Retrive the original random nonce used for encrypting
    const iv = fileContent.slice(fileContent.length - 12);

    // Decrypt the file
    const decryptedFile = await decrypt(fileBuffer, key, iv);

    // Contruct the file
    const file = new File([decryptedFile], this.state.fileName);
    FileSaver.saveAs(file);

    this.setState({ loading: false });
  };

  render() {
    return (
      <Segment>
        <Header size="tiny">Download File</Header>

        <Form onSubmit={this.onSubmit}>
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
            Download
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default FileDownload;
