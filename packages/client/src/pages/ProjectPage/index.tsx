import React from "react";
// UI Components
import { Grid, Divider } from "@material-ui/core";
// Components
import ProjectHeader from "components/ProjectHeader";
import ProjectMergeRequests from "components/ProjectMergeRequests";
// Hooks
import { useParams, Redirect } from "react-router-dom";
import useEthereumProject from "./controllers/useEthereumProject";

const Dashboard = () => {
  const { projectId } = useParams();

  const ethereumProject = useEthereumProject(projectId || "");

  if (!projectId) {
    return <Redirect to="/" />;
  }

  return (
    <Grid container direction="column" spacing={4}>
      <ProjectHeader projectId={projectId} ethereumProject={ethereumProject} />
      <Divider />
      <ProjectMergeRequests projectId={projectId} />
    </Grid>
  );
};

export default Dashboard;
