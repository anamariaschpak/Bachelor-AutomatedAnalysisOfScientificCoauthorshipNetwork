import React, { useContext, useState } from "react";
import {
  Sidebar,
  Menu,
  Icon,
  Responsive,
  Container,
  Segment,
} from "semantic-ui-react";
import { LoginContext } from "./App";
import { useHistory } from "react-router-dom";

export default function SideBar(props) {
  const [visible, setVisible] = useState(false);
  const { setIsLoggedIn } = useContext(LoginContext);
  const history = useHistory();
  const children = props.children;

  const handleToggle = () => {
    setVisible(!visible);
  };

  const NavBarMobile = ({ children, onToggle }) => (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        as={Menu}
        animation={"overlay"}
        icon="labeled"
        inverted
        onHide={() => setVisible(false)}
        vertical
        visible={visible}
        width={"thin"}
      >
        <Menu.Item
          as="a"
          onClick={() => {
            history.push("/home");
          }}
        >
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item
          as="a"
          onClick={() => {
            history.push("/statistics");
          }}
        >
          <Icon name="chart line" />
          Statistics
        </Menu.Item>
      </Sidebar>
      <Sidebar.Pusher dimmed={visible} style={{ minHeight: "100vh" }}>
        <Menu fixed="top" inverted>
          <Menu.Item onClick={onToggle}>
            <Icon name="sidebar" />
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item
              onClick={() => {
                setIsLoggedIn(false);
              }}
              as="a"
            >
              <Icon name="log out" />
              Log Out
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );

  const NavBarDesktop = () => (
    <Menu fixed="top" inverted>
      <Menu.Item
        as="a"
        onClick={() => {
          history.push("/home");
        }}
      >
        <Icon name="home" />
        Home
      </Menu.Item>
      <Menu.Item
        as="a"
        onClick={() => {
          history.push("/statistics");
        }}
      >
        <Icon name="chart line" />
        Statistics
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          onClick={() => {
            setIsLoggedIn(false);
          }}
          as="a"
        >
          <Icon name="log out" />
          Log Out
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );

  const NavBarChildren = ({ children }) => (
    <Container style={{ marginTop: "5em" }}>{children}</Container>
  );

  return (
    <>
      <Responsive {...Responsive.onlyMobile}>
        <NavBarMobile
          onToggle={() => {
            handleToggle();
          }}
        >
          <NavBarChildren>{children}</NavBarChildren>
        </NavBarMobile>
      </Responsive>
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <NavBarDesktop />
        <NavBarChildren>{children}</NavBarChildren>
      </Responsive>
    </>
  );
}
