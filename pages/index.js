import React, { Component } from "react";
import Head from "next/head";
import { Container, Button, Image, Segment } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { getPublicKey } from "../components/getPublicKey";
import db from "../utils/firebase";
import Router from "next/router";

class Index extends Component {
  state = {
    loading: false
  };
  handleClick = async () => {
    if (!window.web3) {
      window.alert("Please install MetaMask first.");
      return;
    }

    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      window.alert("Please login to your Metamask account first.");
      return;
    }

    const publicAddress = accounts[0];
    this.setState({ loading: true });

    const publicKey = await getPublicKey(publicAddress);
    console.log(publicKey);
    this.saveUser(publicAddress, publicKey);
  };

  saveUser = async (publicAddress, publicKey) => {
    const snapshot = await db
      .ref("/users/" + publicAddress.toLowerCase())
      .once("value");
    const userPublicKey = snapshot.val() && snapshot.val().public_key;

    if (userPublicKey) {
      console.log("user exist");
      Router.push("/main");
    } else {
      console.log("adding user ...");
      db.ref("users/" + publicAddress.toLowerCase()).set({
        public_key: publicKey
      });
      Router.push("/main");
    }
  };

  render() {
    return (
      <Container textAlign="center">
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
          />
        </Head>
        <div style={{ marginTop: "10px" }}>
          <Segment>Login to Continue</Segment>
          <Segment basic>
            <Button
              loading={this.state.loading}
              basic
              color="orange"
              onClick={this.handleClick}
            >
              <Image
                src="/static/metamask.png"
                alt="Login With Metamask"
                rounded
              />
            </Button>
          </Segment>
        </div>
      </Container>
    );
  }
}

export default Index;
