import React from "react";
import Layout from "../../components/Layout";
import ArchivedFileList from "../../components/ArchivedFileList";
import { Segment, Header } from "semantic-ui-react";

export default () => {
  return (
    <Layout>
      <Segment>
        <Header>My Archived Files</Header>
        <ArchivedFileList />
      </Segment>
    </Layout>
  );
};
