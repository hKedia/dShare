import React from "react";
import Head from "next/head";
import { Container } from "semantic-ui-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default props => {
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
        />
      </Head>
      <Header />
      <Container style={{ marginTop: "5em" }}>{props.children}</Container>
      <Footer />
    </div>
  );
};
