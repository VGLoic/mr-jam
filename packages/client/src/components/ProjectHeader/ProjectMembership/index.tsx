import React from "react";
// UI Components
import { CircularProgress, Typography, Button } from "@material-ui/core";
// Components
import CreateProjectDialog from "./CreateProjectDialog";
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
    refetch,
    unable,
    loading,
    error,
    projectAddress,
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
        <Button onClick={openDialog} variant="contained">
          Click here to setup on Ethereum
        </Button>
        <CreateProjectDialog
          open={open}
          closeDialog={closeDialog}
          updateProjectAddress={refetch}
          projectName={projectName}
          projectUsers={projectUsers}
        />
      </>
    );
  }

  return <Typography color="textPrimary">Yeay</Typography>;
};

export default ProjectMembership;
