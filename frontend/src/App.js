import React from "react";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";

import "./App.css";
import { Container } from "semantic-ui-react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

function App() {
  return (
    <Container>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
