import React from "react";
// Hooks
import useBountyHandler from "./controllers/useBountyHandler";
// Types
import { UseEthereumProject } from "pages/ProjectPage/controllers/useEthereumProject";
import { MergeRequest } from "components/ProjectMergeRequests/controllers/mergeRequests.types";
// UI Components
import { Box, Typography, Button, Dialog } from "@material-ui/core";
import useDialog from "hooks/useDialog";
// Components
import BountyForm from "./BountyForm";
// Styles
import { useStyles } from "./styles";

interface BountyHandlerProps {
  ethereumProject: UseEthereumProject;
  mergeRequest: MergeRequest;
}
const BountyHandler = ({
  ethereumProject,
  mergeRequest,
}: BountyHandlerProps) => {
  const { bountyDetails, error, refetchBounty } = useBountyHandler({
    mergeRequest,
    projectAddress: ethereumProject.projectAddress || "",
  });
  const { open, closeDialog, openDialog } = useDialog();

  const classes = useStyles();

  if (error) {
    return <Typography color="error">Oh no, it's broken :(</Typography>;
  }

  if (!bountyDetails) return null;

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="space-between">
        <Typography
          color={"textPrimary"}
          variant="body1"
          aria-label="Bounty amount"
        >
          {bountyDetails.amount === 0
            ? "No Bounty Yet"
            : `${bountyDetails.amount} Tokens in Bounty`}
        </Typography>
        <Button
          variant="contained"
          aria-label="Open dialog in order to make a bounty"
          onClick={openDialog}
        >
          Place a bounty
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={closeDialog}
        classes={{ paperScrollPaper: classes.paperScrollPaper }}
      >
        <BountyForm
          ethereumProject={ethereumProject}
          mrId={mergeRequest.id}
          refetchBounty={refetchBounty}
          onClose={closeDialog}
        />
      </Dialog>
    </>
  );
};

export default BountyHandler;
