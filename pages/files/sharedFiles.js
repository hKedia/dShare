import React from "react";
import Layout from "../../components/Layout";
import MySharedFileList from "../../components/MySharedFileList";

export default () => {
  return (
    <Layout>
      <h3>Files Shared by Me</h3>
      <MySharedFileList />
    </Layout>
  );
};
