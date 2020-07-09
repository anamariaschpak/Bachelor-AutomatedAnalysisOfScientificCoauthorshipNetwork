import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ component: Home, isLoggedIn, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        return isLoggedIn ? (
          <Home {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }}
    />
  );
}
