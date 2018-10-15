import React, { Component } from "react";
import { Menu, Container, Label } from "semantic-ui-react";
import Link from "next/link";
import web3 from "../ethereum/web3";

class Footer extends Component {
  state = {
    account: "",
    network: ""
  };
  componentDidMount = async () => {
    const accounts = await web3.eth.getAccounts();
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
