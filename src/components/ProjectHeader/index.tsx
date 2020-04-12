import React from "react";
import classnames from "classnames";
import { useQuery } from "@apollo/client";
// UI Components
import {
  Typography,
  Grid,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress
} from "@material-ui/core";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
// Hooks
import { useDialog } from "hooks/useDialog";
// Query
import {
  PROJECT_OVERVIEW
} from "./controllers/projectOverview.query";
// Types
import {
  ProjectOverviewData,
  ProjectOverviewInput
} from "./controllers/projectOverview.types";
// Styles
import { useStyles, Styles } from "./styles";

interface ProjectHeaderProps {
  projectId: string;
}
const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
  const { data, loading, error } = useQuery<ProjectOverviewData, ProjectOverviewInput>(
    PROJECT_OVERVIEW,
    {
      variables: { projectId }
    }
  );
  const { open, toggleDialog } = useDialog();
  const classes: Styles = useStyles();

  if (loading) {
    return (
      <Grid item>
        <CircularProgress
          data-testid="project-overview-loading"
          aria-label="Project overview is loading"
        />
      </Grid>
    );
  }

  if (error || !data?.project) {
    return (
      <Grid item>
        <Typography
          variant="h6"
          component="h6"
          color="textPrimary"
          data-testid="project-overview-error"
          aria-label={`Project with id ${projectId} has not been found`}
        >
          This project has not been found. Please select another one.
        </Typography>
      </Grid>
    );
  }

  const project = data.project;

  const tooMuchUsers: boolean = project.users.length > 5;

  return (
    <>
      <Grid item container xs={12} direction="row" justify="space-between">
        <Grid item container sm={8}>
          <Typography
            variant="h6"
            component="h6"
            className={classes.projectTitle}
            color="textPrimary"
            data-testid="project-name"
            aria-label={`Project name: ${project.name.toUpperCase()}`}
          >
            {project.name.toUpperCase()}
          </Typography>
          <AvatarGroup>
            {tooMuchUsers ? (
              <div className={classes.avatarWrapper}>
                {project.users.slice(0, 5).map(user => (
                  <Tooltip title={user.name} key={user.id}>
                    <Avatar
                      className={classes.avatar}
                      alt={user.name}
                      src={user.avatarUrl}
                      data-testid="user-avatar"
                    />
                  </Tooltip>
                ))}
                <Avatar
                  className={classnames(classes.avatar, classes.seeMore)}
                  onClick={toggleDialog}
                  data-testid="avatar-open-dialog"
                  aria-label="Open project users dialog"
                >
                  <Typography
                    variant="subtitle2"
                    color="textPrimary"
                  >
                    +{project.users.length - 5}
                  </Typography>
                </Avatar>
              </div>
            ) : (
              project.users.map(user => (
                <Tooltip title={user.name} key={user.id}>
                  <Avatar
                    className={classes.avatar}
                    alt={user.name}
                    src={user.avatarUrl}
                    data-testid="user-avatar"
                  />
                </Tooltip>
              ))
            )}
          </AvatarGroup>
        </Grid>
        <Grid item container sm={4} justify="flex-end">
          <Typography
            variant="body1"
            className={classes.fullPathLabel}
            color="textPrimary"
          >
            Full path:
          </Typography>
          <Typography variant="body1" color="textSecondary" data-testid="full-path" aria-label={`Full path: ${project.pathWithNamespace}`}>
            {project.pathWithNamespace}
          </Typography>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>Project users</DialogTitle>
        <List>
          {project.users.map(user => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar
                  className={classes.avatar}
                  alt={user.name}
                  src={user.avatarUrl}
                  key={user.id}
                  data-testid="avatar-dialog"
                />
              </ListItemAvatar>
              <ListItemText aria-label={`name: ${user.name}`}>{user.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
};

export default ProjectHeader;
