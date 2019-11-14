import React, { Component } from "react";
import Head from "next/head";
import { Container, Button, Image, Segment, Grid } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { getPublicKey } from "../utils/getPublicKey";
import db from "../utils/firebase";
import Router from "next/router";

/**
 * Base component to handle user login
 */

class Login extends Component {
  state = {
    loading: false
  };

  /** Preventing page reload when network is changed in metamask */
  componentDidMount() {
    window.onbeforeunload = function (e) {
      var dialogText = "Screw the MetaMask";
      e.returnValue = dialogText;
      return dialogText;
    };
  }

  /**
   * Function to handle user interaction with the login button
   */

  handleClick = async () => {
    if (!window.web3) {
      window.alert("Please install MetaMask first.");
      return;
    }

    /** Check if web3 provider is connected to the rinkeby network */
    if ((await web3.eth.net.getNetworkType()) != "rinkeby") {
      window.alert(
        "Please Connect to Rinkeby Network. When changing network, the page will try to reload, please cancel."
      );
      return;
    }
    let accounts;
    accounts = await web3.eth.getAccounts();

    /** Prompt user for access */
    if (accounts.length === 0) {
      try {
        await window.ethereum.enable();
        accounts = await web3.eth.getAccounts();
      } catch (error) {
        alert("You to grant access to use the application.");
        return;
      }
    }

    const publicAddress = accounts[0];
    this.setState({ loading: true });

    /** Get user public key or handle the rejection */
    let publicKey;
    try {
      publicKey = await getPublicKey(publicAddress);
    } catch (error) {
      this.setState({ loading: false });
      alert("You need to sign the message to login.");
      return;
    }
    this.saveUser(publicAddress, publicKey);
  };

  /**
   * Saves user's publicKey to the database if it does not exist
   * @param {string} publicAddress The ethereum address of the user
   * @param {string} publicKey The public key for the corresponding ethereum address
   */

  saveUser = async (publicAddress, publicKey) => {
    const snapshot = await db
      .ref("/users/" + publicAddress.toLowerCase())
      .once("value");
    const userPublicKey = snapshot.val() && snapshot.val().public_key;

    /** If the public key does not exist then save it to the database */
    if (!userPublicKey) {
      await db.ref("users/" + publicAddress.toLowerCase()).set({
        public_key: publicKey
      });
    }
    Router.push("/files/");
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
        <Grid style={{ marginTop: "0" }}>
          <Grid.Row>
            <Grid.Column>
              <Segment>Click to Continue</Segment>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment basic size="small">
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
                    size="medium"
                  />
                </Button>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Segment size="big" padded>
                <p>Sign in to the application by clicking the button above.</p>
                <p>
                  Make sure Metamask is installed and connected to the rinkeby
                  network. If not, you can download from{" "}
                  <a href="https://metamask.io/">here</a>.
                </p>
                <p>
                  You should also have some ether to use this application. Get
                  some test rinkeby ether from the{" "}
                  <a href="https://faucet.rinkeby.io/">Rinkeby Faucet</a>.
                </p>
                <p>
                  When you click the button, the Metamask window pops up which
                  asks you to sign a random value.
                </p>
                <p>
                  From the signature, your public Ethereum key is calculated and
                  saved in the database as it's used later to encrypt the
                  document keys.
                </p>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default Login;
