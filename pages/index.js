import React, { Component } from "react";
import Head from "next/head";
import { Container, Segment, Button, Grid } from "semantic-ui-react";
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
        <Grid style={{ marginTop: "10px" }}>
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
        </Grid>
      </Container>
    );
  }
}

export default Index;
