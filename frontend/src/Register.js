import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center" dividing>
          Sign-up for a new account
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="E-mail address"
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Confirm password"
            />
            <Button fluid circular size="large" color="teal">
              Sign Up
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}
