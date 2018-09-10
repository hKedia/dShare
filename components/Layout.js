import React from "react";
import Head from "next/head";
import { Container } from "semantic-ui-react";
import Header from "../components/Header";

export default props => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
        />
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};
