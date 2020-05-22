import React from "react";
// Types
import { UseEthereumProject } from "pages/ProjectPage/controllers/useEthereumProject";
// UI Components
import {
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  CircularProgress,
} from "@material-ui/core";
// Hooks
import usePlaceBounty from "./controllers/usePlaceBounty";

interface BountyFormProps {
  ethereumProject: UseEthereumProject;
  mrId: string;
  refetchBounty: () => Promise<void>;
  onClose: () => void;
}
const BountyForm = ({
  ethereumProject,
  mrId,
  refetchBounty,
  onClose,
}: BountyFormProps) => {
  const { amount, onChange, placeBounty, transactionState } = usePlaceBounty({
    mrId,
    refetchBounty,
    refetchBalance: ethereumProject.refetchBalance,
    onClose,
    projectAddress: ethereumProject.projectAddress as string,
  });

  const formError =
    amount === ""
      ? ""
      : Number(amount) <= 0
      ? "Amount must be positive"
      : Number(amount) > (ethereumProject.balance as number)
      ? "You don't have enough tokens"
      : "";

  return (
    <>
      <DialogTitle>Place a Bounty</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Bounty amount"
          aria-label="Fill bounty amount"
          name="amount"
          margin="dense"
          // fullWidth
          autoComplete="off"
          type="number"
          value={amount}
          helperText={formError}
          error={Boolean(formError)}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button aria-label="Close dialog" onClick={onClose}>
          Cancel
        </Button>
        <Button
          aria-label="Confirm bounty placement"
          onClick={placeBounty}
          disabled={!Boolean(amount) || Boolean(formError)}
        >
          {transactionState.loading ? (
            <CircularProgress size={20} />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </>
  );
};

export default BountyForm;
