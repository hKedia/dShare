import React, { Component } from "react";
import { Menu, Container } from "semantic-ui-react";
import web3 from "../ethereum/web3";

/** Describes the Footer component of the application */
class Footer extends Component {
  state = {
    account: "",
    network: ""
  };
  /** Gets the current account and current network user is connected to */
  componentDidMount = async () => {
    /** Retrieve the current account */
    const accounts = await web3.eth.getAccounts();

    /** Retrieve the current connected network */
    const network = await web3.eth.net.getNetworkType();
    let account = accounts[0];
    this.setState({ account, network });
  };
  render() {
    return (
      <Menu fixed="bottom">
        <Container>
          <Menu.Item>Logged in as: {this.state.account}</Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item>Connected to: {this.state.network}</Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

export default Footer;
