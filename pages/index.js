import React, { Component } from "react";
import Head from "next/head";
import { Container, Segment, Button, Grid, Image } from "semantic-ui-react";
import Link from "next/link";

class Index extends Component {
  render() {
    return (
      <Container>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
          />
        </Head>
        <Grid style={{ marginTop: "0" }}>
          <Grid.Row verticalAlign="middle">
            <Grid.Column width={13}>
              <Segment textAlign="center">
                Welcome to dShare - A decentralized file sharing application
              </Segment>
            </Grid.Column>
            <Grid.Column width={3}>
              <Link href="/login">
                <Button basic floated="right" size="big" color="blue">
                  Take me to Login
                </Button>
              </Link>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment size="big" padded>
                <Image
                  src="/static/bitcoin-icon.png"
                  floated="left"
                  size="tiny"
                  href="https://bitcoin.org/"
                />
                <p>
                  dShare is a decentralized file sharing application with
                  immutable timestamping built using Bitcoin, Ethereum and IPFS
                  technologies.
                </p>
                <br />
                <p>
                  When a user uploads a file, it's first encrypted and then
                  uploaded to the IPFS network. The key used for encrypting the
                  file is then encrypted with the Ethereum public key of the
                  uploader. Once encrypted, the key is also uploaded to the IPFS
                  network.
                </p>
                <Image
                  src="/static/ethereum-icon.png"
                  floated="right"
                  size="tiny"
                  href="https://www.ethereum.org/"
                />
                <p>
                  Once the file is successfully uploaded, it can be shared with
                  any Ethereum address.
                </p>

                <p>
                  When a user shares a file, the key used for encrypting the
                  file is downloaded from the IPFS network. Once the key is
                  downloaded, it's decrypted using uploader's private key and
                  encrypted again with the recipient's public Ethereum key.
                  After this it's again uploaded to the IPFS network.
                </p>
                <br />
                <Image
                  src="/static/ipfs-icon.png"
                  floated="left"
                  size="tiny"
                  href="https://ipfs.io/"
                />
                <p>
                  IPFS references of files and their key is facilitated through
                  the Smart contract which is deployed on the Ethereum (Rinkeby)
                  network.
                </p>
                <br />
                <p>
                  An Immutable timestamp of the file is created by submitting
                  the SHA-256 hash of the file to the Bitcoin blockchain using
                  the <a href="https://originstamp.org/">OriginStamp</a> API.
                </p>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default Index;
