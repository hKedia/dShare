import React from "react";
import Layout from "../../components/Layout";
import SharedFileList from "../../components/SharedFileList";
import { Segment, Header } from "semantic-ui-react";

export default () => {
  return (
    <Layout>
      <Segment>
        <Header>Files Shared with Others</Header>
        <SharedFileList />
      </Segment>
    </Layout>
  );
};
