import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";
// UI Components
import CssBaseline from "@material-ui/core/CssBaseline";
// Components
import Layout from "components/Layout";
// Pages
import ProjectPage from "pages/ProjectPage";
import NoSelectedProject from "pages/NoSelectedProject";
// Context
import { useAuth } from "contexts/auth";
import { ThemeProvider } from "contexts/theme";

const App = () => {
  const { isAuthInitialized, isAuthenticated } = useAuth();

  if (!isAuthInitialized) {
    return <div>Initialization...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Fragment>
      <CssBaseline />
      <ThemeProvider>
        <Layout>
          <Switch>
            <Route path="/projects/:projectId">
              <ProjectPage />
            </Route>
            <Route path="/">
              <NoSelectedProject />
            </Route>
          </Switch>
        </Layout>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
