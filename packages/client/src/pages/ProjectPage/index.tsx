import React from "react";
// UI Components
import { Grid, Divider } from "@material-ui/core";
// Components
import ProjectHeader from "components/ProjectHeader";
import ProjectMergeRequests from "components/ProjectMergeRequests";
// Hooks
import { useParams, Redirect } from "react-router-dom";

const Dashboard = () => {
  const { projectId } = useParams();

  if (!projectId) {
    return <Redirect to="/" />;
  }

  return (
    <Grid container direction="column" spacing={4}>
      <ProjectHeader projectId={projectId} />
      <Divider />
      <ProjectMergeRequests projectId={projectId} />
    </Grid>
  );
};

export default Dashboard;
