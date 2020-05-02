import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    // console.log("email: " + email);
    // console.log("pass: " + password);
    event.preventDefault();
  }

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="teal" textAlign="center" dividing>
          Log-in to your account
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(ev) => setPassword(ev.target.value)}
            />

            <Button
              color="teal"
              fluid
              size="large"
              circular
              onClick={handleSubmit}
              disabled={!validateForm()}
            >
              Login
            </Button>
          </Segment>
        </Form>
        <Message>
          Not registered yet? <a href="#">Sign Up</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
}
