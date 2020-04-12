import React from "react";
// UI Components
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  CircularProgress,
  Grid
} from "@material-ui/core";
// Components
import ProjectList from "./ProjectList";
// Controllers
import { useProjectSelectionDialog } from "./controllers/useProjectSelectionDialog";
// Styles
import { useStyles } from "./styles";

type ProjectSelectionDialogProps = {
  open: boolean;
  toggleDialog: () => void;
};
const ProjectSelectionDialog = ({
  open,
  toggleDialog
}: ProjectSelectionDialogProps) => {
  const {
    triggerSearch,
    onLoadMore,
    called,
    researchLoading,
    loadingMore,
    data,
    selectProject,
    selectedProjectId,
    onClose,
    confirm
  } = useProjectSelectionDialog(toggleDialog);

  const classes = useStyles();

  return (
    <Dialog
      classes={{ paperScrollPaper: classes.paperScrollPaper }}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Choose a project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Find and choose the project that you want to work on
        </DialogContentText>
        <Grid container alignItems="center">
          <Grid item xs={9}>
            <TextField
              autoFocus
              label="Project name"
              aria-label="Search project by its name"
              name="project-name-search"
              id="project-name-search"
              margin="dense"
              fullWidth
              autoComplete="off"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                triggerSearch(e.target.value)
              }
            />
          </Grid>
          <Grid item xs={3} className={classes.circularProgress}>
            {researchLoading && <CircularProgress size="30px" data-testid="research-loading" aria-label="Searching projects" />}
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          spacing={2}
          className={classes.projectsWrapper}
        >
          <ProjectList
            called={called}
            loadingMore={loadingMore}
            researchLoading={researchLoading}
            hasNextPage={Boolean(data?.projects.pageInfo.hasNextPage)}
            entries={data?.projects.edges || []}
            onLoadMore={onLoadMore}
            selectProject={selectProject}
            selectedProjectId={selectedProjectId}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          aria-label="Close dialog, stop selection of project"
          data-testid="cancel-action-dialog"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          aria-label={selectedProjectId ? `Confirm selection of project id ${selectedProjectId}`: "Confirm disabled while no choice"}
          data-testid="confirm-action-dialog" 
          onClick={confirm}
          disabled={!Boolean(selectedProjectId)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectSelectionDialog;
