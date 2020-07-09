import React, { useState } from "react";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import PrivateRoute from "./PrivateRoute";

import "./App.css";
import { Container } from "semantic-ui-react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export const LoginContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const setLoggedIn = (isLoggedIn) => {
    setIsLoggedIn(isLoggedIn);
  };

  return (
    <Container>
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn: setLoggedIn }}>
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute
              exact
              path="/home"
              component={Home}
              isLoggedIn={isLoggedIn}
            />

            {/* TODO: make Home private route using isLoggedIn state in order to prevent accessing Home without being logged in and to persist the isLoggedIn state */}
          </Switch>
        </Router>
      </LoginContext.Provider>
    </Container>
  );
}

export default App;
