import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
import { useHistory } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return (
      email.length > 0 &&
      password.length > 0 &&
      username.length > 0 &&
      confirmPassword.length > 0
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      }),
    };

    fetch(
      `${process.env.REACT_APP_REST_API_URL}/register`,
      requestOptions
    ).then((response) => {
      if (response.status == 200) {
        history.push("/login");
      } else {
        if (response.status == 400) {
          alert("User already exists!");
        }
      }
    });
  }

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
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={(ev) => setUsername(ev.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              type="password"
              iconPosition="left"
              placeholder="Password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <Form.Input
              fluid
              icon="lock"
              type="password"
              iconPosition="left"
              placeholder="Confirm password"
              onChange={(ev) => setConfirmPassword(ev.target.value)}
            />
            <Button
              fluid
              circular
              size="large"
              color="teal"
              onClick={handleSubmit}
              disabled={!validateForm()}
            >
              Sign Up
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}
