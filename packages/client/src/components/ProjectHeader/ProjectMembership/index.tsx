import React from "react";
// UI Components
import { CircularProgress, Typography, Button, Box } from "@material-ui/core";
// Components
import CreateProjectDialog from "./CreateProjectDialog";
import ManageProjectDialog from "./ManageProjectDialog";
// Hooks
import useProjectMembership from "./controllers/useProjectMembership";
import useDialog from "hooks/useDialog";
// Types
import { User } from "types/user";

interface ProjectMembershipProps {
  projectName: string;
  projectUsers: User[];
}
const ProjectMembership = ({
  projectName,
  projectUsers,
}: ProjectMembershipProps) => {
  const {
    refetchProjectAddress,
    unable,
    loading,
    error,
    projectAddress,
    isMember,
    isAdmin,
  } = useProjectMembership(projectName);

  const { open, closeDialog, openDialog } = useDialog();

  if (unable) return null;

  if (loading) {
    return (
      <CircularProgress
        data-testid="project-address-loading"
        aria-label="Searching for existing project"
      />
    );
  }

  if (error) {
    return (
      <Typography
        data-testid="project-address-error"
        aria-label="There has been an error... :("
        color="textPrimary"
      >
        There has been an error... :(
      </Typography>
    );
  }

  if (!projectAddress) {
    return (
      <>
        <Button
          onClick={openDialog}
          variant="contained"
          aria-label="Open project creation dialog"
          data-testid="project-creation-dialog-button"
        >
          Click here to setup on Ethereum
        </Button>
        <CreateProjectDialog
          open={open}
          closeDialog={closeDialog}
          updateProjectAddress={refetchProjectAddress}
          projectName={projectName}
          projectUsers={projectUsers}
        />
      </>
    );
  }

  if (!isMember) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center">
      <Typography
        data-testid="member"
        aria-label="You are a member"
        color="textPrimary"
      >
        Youpi
      </Typography>
      {isAdmin && (
        <>
          <Button
            onClick={openDialog}
            variant="contained"
            aria-label="Open project management dialog"
            data-testid="project-management-dialog-button"
          >
            Manage Project
          </Button>
          <ManageProjectDialog
            open={open}
            closeDialog={closeDialog}
            projectAddress={projectAddress}
            projectUsers={projectUsers}
          />
        </>
      )}
    </Box>
  );
};

export default ProjectMembership;
