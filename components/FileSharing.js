import React, { Component } from "react";
import { Segment, Header, Form, Button, Input } from "semantic-ui-react";

class FileSharing extends Component {
  state = {
    recipient: ""
  };

  componentDidMount = async () => {};

  onSubmit = async event => {
    event.preventDefault();
    console.log("recipient", this.state.recipient);

    this.setState({ loading: true });
  };
  render() {
    return (
      <Segment>
        <Header size="tiny">
          Share file by entering the Ethereum Address of the recipient
        </Header>

        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <Input
              placeholder="0x0000000000000000000000000000000000000000"
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          <Button primary loading={this.state.loading} type="submit">
            Share
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default FileSharing;
