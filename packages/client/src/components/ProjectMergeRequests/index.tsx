import React from "react";
import classnames from "classnames";
// UI Components
import { Grid, CircularProgress, Typography, Button } from "@material-ui/core";
// Hooks
import { useProjectMergeRequests } from "./controllers/useProjectMergeRequests";
// Components
import MergeRequestCard from "./MergeRequestCard";
import StateMenu from "./StateMenu";
import DateChoice from "./DateChoice";
// Styles
import { useStyles } from "./styles";

interface ProjectMergeRequestsProps {
  projectId: string;
}
const ProjectMergeRequests = ({ projectId }: ProjectMergeRequestsProps) => {
  const {
    selectedMrState,
    selectMrState,
    data,
    initialLoading,
    loadingMore,
    error,
    onLoadMore,
    fromDate,
    toDate,
    onChangeFrom,
    onChangeTo
  } = useProjectMergeRequests(projectId);

  const classes = useStyles();

  const Core: JSX.Element[] | JSX.Element = initialLoading ? (
    <Grid item>
      <CircularProgress />
    </Grid>
  ) : error || !data ? (
    <Grid item>
      <Typography color="textSecondary">
        Oh no, we didn't succeed to retrieve the merge requests :(
      </Typography>
    </Grid>
  ) : data.project.mergeRequests.edges.length === 0 ? (
    <Grid item>
      <Typography color="textSecondary">
        No merge requests have been found for this project...
      </Typography>
    </Grid>
  ) : (
    data.project.mergeRequests.edges.map(({ node: mergeRequest }) => (
      <MergeRequestCard key={mergeRequest.id} mergeRequest={mergeRequest} />
    ))
  );

  return (
    <Grid item container spacing={2}>
      <Grid item xs={6} md={3}>
        <Typography variant="h6" color="textSecondary">
          Merge Requests:
        </Typography>
      </Grid>
      <Grid item container xs={6} md={4} justify="center">
        <StateMenu
          selectedMrState={selectedMrState}
          selectMrState={selectMrState}
        />
      </Grid>
      <Grid item xs={12} md={5} >
        <DateChoice
          fromDate={fromDate}
          toDate={toDate}
          onChangeFrom={onChangeFrom}
          onChangeTo={onChangeTo}
        />
      </Grid>
      {Core}
      <Grid item xs={12} container justify="center">
        <Button
          className={classnames({
            [classes.hidden]:
              initialLoading ||
              !data ||
              !data?.project.mergeRequests.pageInfo.hasNextPage
          })}
          disabled={loadingMore}
          onClick={onLoadMore}
        >
          {loadingMore ? <CircularProgress /> : "Load more"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProjectMergeRequests;
