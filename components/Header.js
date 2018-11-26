import React from "react";
import { Menu, Container, Modal, Icon, Header } from "semantic-ui-react";
import Link from "next/link";
import Router from "next/router";
import Help from "../components/Help";

/**
 * Decribes the Header which lists the navigation options for the user
 */
export default () => {
  return (
    <Menu fixed="top">
      <Container>
        <Link href="/files/">
          <a className="item">Home</a>
        </Link>

        <Link href="/files/sharedFiles">
          <a className="item">View Shared Files</a>
        </Link>

        <Link href="/files/archivedFiles">
          <a className="item">View Archived Files</a>
        </Link>

        <Menu.Menu position="right">
          <Link href="/files/proof">
            <a className="item">Download Timestamp Proof</a>
          </Link>

          <Link href="/files/upload">
            <a className="item">Upload Files</a>
          </Link>

          <Modal
            trigger={
              <a className="item">
                <Icon name="help" />
              </a>
            }
            centered={false}
          >
            <Header>
              <Icon name="help" />
              Help Page
            </Header>
            <Modal.Content>
              <Help />
            </Modal.Content>
          </Modal>

          <Link href="/login">
            <a className="item">Logout</a>
          </Link>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};
