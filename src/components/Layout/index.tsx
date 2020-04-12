import React from "react";
// UI Components
import { Grid } from "@material-ui/core";
// Component
import Header from "components/Header";
// Styles
import { useStyles } from "./styles";

type LayoutProps = { children: React.ReactNode };
const Layout = ({ children }: LayoutProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header className={classes.header} />
      <main className={classes.content}>
        <Grid container>
          <Grid item md={1} />
          <Grid item md={10} className={classes.itemContent}>
            {children}
          </Grid>
          <Grid item md={1} />
        </Grid>
      </main>
    </div>
  );
};

export default Layout;
