import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
// App
import App from "./App";
// Workers
import * as serviceWorker from "./serviceWorker";
// Context
import { AuthProvider } from "contexts/auth";
// Services
import { client } from "./services/apollo.service";

ReactDOM.render(
  <Router>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ApolloProvider>
    </MuiPickersUtilsProvider>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
