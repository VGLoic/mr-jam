import React from "react";
import { useQuery } from "@apollo/client";
// UI Components
import {
  Grid,
  Hidden,
  CircularProgress,
  Button,
  Avatar,
  IconButton,
  SvgIcon,
  Tooltip
} from "@material-ui/core";
import { mdiBrightness6 } from "@mdi/js";
// Components
import ProjectSelectionDialog from "./ProjectSelectionDialog";
// Query
import { CURRENT_USER } from "./controllers/currentUser.query";
// Types
import { CurrentUserData } from "./controllers/currentUser.types";
// Hooks
import { useDialog } from "hooks/useDialog";
// Styles
import { useStyles } from "./styles";
import { useTheme } from "contexts/theme";

type HeaderProps = { className: string };
const Header = ({ className }: HeaderProps) => {
  const { loading, error, data } = useQuery<CurrentUserData>(CURRENT_USER);
  const { open, toggleDialog } = useDialog();

  const { toggleMode, isDarkMode } = useTheme();

  const classes = useStyles();

  if (error) {
    return <div
      className={className}
      data-testid="header-error"
      aria-label="Header can not be displayed"
    >
      Oh no, it's broken :(
    </div>;
  }

  return (
      <Grid
        className={className}
        container
        justify="space-around"
        alignItems="center"
        data-testid="header-container"
      >
        <Hidden xsDown>
          <Grid item container sm={3} data-testid="nyan-cat-animation" alignItems="center">
            <img src="https://media.giphy.com/media/7lsw8RenVcjCM/giphy.gif" alt="nyan-cat" className={classes.nyanCat} />
          </Grid>
        </Hidden>
        <Grid item container sm={6} xs={9} justify="center">
          <Button
            variant="outlined"
            onClick={toggleDialog}
            data-testid="select-project-button"
            aria-label="Select a project"
          >
            Select a project
          </Button>
        </Grid>
        <Hidden xsDown>
          <Grid item container sm={3} justify="flex-end">
            <Grid item container justify="flex-end" alignItems="center">
              <Tooltip
                title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              >
                <IconButton
                  data-testid="toggle-mode-button"
                  aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
                  onClick={toggleMode}
                >
                  <SvgIcon>
                    <path d={mdiBrightness6} />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
              {loading
                ? (<CircularProgress data-testid="user-avatar-circular-progress" aria-label="User data is loading" />)
                : (
                  <Avatar
                    data-testid="user-avatar"
                    aria-label="Open user menu"
                    src={data?.currentUser.avatarUrl}
                    alt="avatar-user"
                    className={classes.avatar}
                  />
                )
              }
            </Grid>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid item sm={3} data-testid="later plz">
            My Icon
          </Grid>
        </Hidden>
      <ProjectSelectionDialog open={open} toggleDialog={toggleDialog} />
      </Grid>
  );
};

export default Header;
