import React from "react";
import classnames from "classnames";
// UI Components
import {
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Button,
  CircularProgress
} from "@material-ui/core";
// Types
import { ProjectEdge } from "../controllers/projects.types";
// Styles
import { useStyles } from "./styles";

interface ProjectListProps {
  called: boolean;
  loadingMore: boolean;
  researchLoading: boolean;
  entries: ProjectEdge[];
  hasNextPage: boolean;
  onLoadMore: () => void;
  selectProject: (projectId: string) => void;
  selectedProjectId: string | null;
}
const ProjectList = ({
  called,
  loadingMore,
  researchLoading,
  entries,
  hasNextPage,
  onLoadMore,
  selectProject,
  selectedProjectId
}: ProjectListProps) => {
  const classes = useStyles();

  const Core: JSX.Element[] | JSX.Element | null =
    !called ? null : entries.length === 0 ? (
      <Typography
        data-testid="no-project-found-typography"
        aria-label="No project has been found"
        variant="body2"
        color="textSecondary"
        component="p"
      >
        No project has been found...
      </Typography>
    ) : (
      entries.map(
        ({ node: project }): JSX.Element => (
          <Grid
            item
            xs={12}
            key={project.id}
            onClick={(): void => selectProject(project.id)}
            aria-label={`Choose project ${project.name}, id ${project.id}, path ${project.pathWithNamespace}`}
          >
            <Card
              className={classnames({
                [classes.selectedCard]: project.id === selectedProjectId
              })}
            >
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h5">
                    {project.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    Full path: {project.pathWithNamespace}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )
      )
    );

  return (
    <>
      {Core}
      <Grid item xs={12} container justify="center">
        <Button
          className={classnames({
            [classes.hidden]: researchLoading || !hasNextPage
          })}
          disabled={loadingMore}
          onClick={onLoadMore}
          data-testid="load-more-button"
          aria-label="Load more projects"
        >
          {loadingMore ? <CircularProgress data-testid="load-more-loading" aria-label="Loading more projects" /> : "Load more"}
        </Button>
      </Grid>
    </>
  );
};

export default ProjectList;
