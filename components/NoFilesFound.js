import React from "react";
import { Message } from "semantic-ui-react";

export default props => {
  return (
    <Message negative hidden={props.hidden}>
      No Files Found!!!
    </Message>
  );
};
