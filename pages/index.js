import React, { Component } from "react";
import Head from "next/head";
import {
  Container,
  Segment,
  Button,
  Grid,
  Image,
  Icon,
  Header
} from "semantic-ui-react";
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
            <Grid.Column width={10}>
              <Segment textAlign="center">
                <Header as="h4">
                  Welcome to dShare - Ethereum
                </Header>
              </Segment>
            </Grid.Column>
            <Grid.Column width={3}>
              <Link href="/login">
                <Button basic fluid size="big" color="blue">
                  <Icon name="sign-in" /> To Login
                </Button>
              </Link>
            </Grid.Column>
            <Grid.Column width={3}>
              <a href="https://github.com/hKedia/dShare">
                <Button basic fluid size="big" color="black">
                  <Icon name="github" /> Github
                </Button>
              </a>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment.Group>
                <Segment textAlign="center" size="big">
                  <p>App Architecture</p>
                </Segment>
                <Segment>
                  <Image src="/static/architecture.png" centered />
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment.Group>
                <Segment textAlign="center" size="big">
                  <p>File Upload</p>
                </Segment>
                <Segment>
                  <Image src="/static/upload.png" centered />
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment.Group>
                <Segment textAlign="center" size="big">
                  <p>File Sharing</p>
                </Segment>
                <Segment>
                  <Image src="/static/share.png" centered />
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment.Group>
                <Segment textAlign="center" size="big">
                  <p>Using the Application</p>
                </Segment>
                <Segment>
                  <Image src="/static/connect-to-metamask.png" centered />
                </Segment>

                <Segment>
                  <Image src="/static/app-login-prompt.png" centered />
                </Segment>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default Index;
