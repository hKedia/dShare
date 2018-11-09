import React, { Component } from "react";
import Head from "next/head";
import { Container } from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Router from "next/router";
import NProgress from "nprogress";

Router.events.on("routeChangeStart", url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

class Layout extends Component {
  render() {
    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
          />
          <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        </Head>
        <Header />
        <Container style={{ margin: "5em 5em" }}>
          {this.props.children}
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Layout;
