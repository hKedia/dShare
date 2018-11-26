import React, { Component } from "react";
import Head from "next/head";
import { Container } from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Router from "next/router";
import NProgress from "nprogress";
import { ToastContainer, Slide } from "react-toastify";

/** Loader which shows up when user navigates to another page within the application */
Router.events.on("routeChangeStart", url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

/**
 * Decribes the parent component which wraps around all other components
 */

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
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/ReactToastify.min.css"
          />
        </Head>
        <Header />
        <Container style={{ margin: "4em 0 3em 0" }}>
          {this.props.children}
        </Container>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          transition={Slide}
        />
        ;
        <Footer />
      </div>
    );
  }
}

export default Layout;
