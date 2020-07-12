import React, { useState, useContext } from "react";

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import PrivateRoute from "./PrivateRoute";
import Statistics from "./Statistics";

import "./App.css";
import { Container } from "semantic-ui-react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SideBar from "./SideBar";

export const LoginContext = React.createContext();
export const GraphDataContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [graph, setGraph] = useState(null);

  const setIsLoggedInFunction = (isLoggedIn) => {
    setIsLoggedIn(isLoggedIn);
  };

  const setGraphFunction = (graph) => {
    setGraph(graph);
  };

  return (
    <Container>
      <LoginContext.Provider
        value={{ isLoggedIn, setIsLoggedIn: setIsLoggedInFunction }}
      >
        <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <GraphDataContext.Provider
              value={{ graph, setGraph: setGraphFunction }}
            >
              <SideBar>
                <PrivateRoute
                  exact
                  path="/home"
                  component={Home}
                  isLoggedIn={isLoggedIn}
                />
                <PrivateRoute
                  exact
                  path="/statistics"
                  component={Statistics}
                  isLoggedIn={isLoggedIn}
                />
              </SideBar>
            </GraphDataContext.Provider>
          </Switch>
        </Router>
      </LoginContext.Provider>
    </Container>
  );
}

export default App;
