import React, { useState } from "react";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Container>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/home" component={Home} />
          {/* TODO: make Home private route using isLoggedIn state in order to prevent accessing Home without being logged in and to persist the isLoggedIn state */}
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
