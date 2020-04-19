import React from "react";
// UI Components
import { Typography } from "@material-ui/core";

const NoSelectedProject = () => {
  return (
    <Typography variant="h6" component="h6" color="textPrimary">
      No project has been selected yet.
    </Typography>
  );
};

export default NoSelectedProject;
