import React from "react";
// UI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  TextField,
  Box,
  Avatar,
  CircularProgress,
  IconButton,
  SvgIcon,
  Chip,
  Tooltip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
// Icons
import { mdiAccountPlus } from "@mdi/js";
// Hooks
import useManageProject from "./controllers/useManageProject";
// Styles
import { useStyles } from "./styles";
// Types
import { User } from "types/user";

interface ManageProjectDialogProps {
  open: boolean;
  closeDialog: () => void;
  projectAddress: string;
  projectUsers: User[];
}
const ManageProjectDialog = ({
  open,
  closeDialog,
  projectAddress,
  projectUsers,
}: ManageProjectDialogProps) => {
  const {
    unable,
    additionalUserInputContext,
    additionalUsers,
    addUser,
    removeUser,
    inviteUsers,
    transactionState,
    isConfirmDisabled,
  } = useManageProject({
    projectAddress,
    closeDialog,
  });

  const classes = useStyles();

  if (unable) return null;

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      classes={{ paperScrollPaper: classes.paperScrollPaper }}
    >
      <DialogTitle>Manage this project on ethereum</DialogTitle>
      <DialogContent>
        <DialogContentText>Invite users on this project</DialogContentText>
        <Grid container alignItems="center" spacing={3}>
          <Grid container item xs={10} alignItems="center" spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                data-testid="additional-user-select"
                id="additional-user-select"
                disableClearable
                fullWidth
                options={projectUsers}
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderOption={(option) => (
                  <Box display="flex">
                    <Avatar className={classes.avatar} src={option.avatarUrl} />
                    <span>{option.name}</span>
                  </Box>
                )}
                getOptionSelected={(option: User, value: User) =>
                  option.id === value.id
                }
                value={additionalUserInputContext.userValue}
                onChange={additionalUserInputContext.handleUserChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="additional-address-input"
                data-testid="additional-address-input"
                label="Address"
                value={additionalUserInputContext.addressValue}
                onChange={additionalUserInputContext.handleAddressChange}
                error={additionalUserInputContext.addressError}
              />
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              data-testid="add-user-button"
              arial-label="Add this user"
              disabled={additionalUserInputContext.isConfirmDisabled}
              onClick={addUser}
            >
              <SvgIcon>
                <path d={mdiAccountPlus} />
              </SvgIcon>
            </IconButton>
          </Grid>
        </Grid>
        <Box
          display="flex"
          flexWrap="wrap"
          className={classes.additionalUsersContainer}
        >
          {additionalUsers.map((wrappedUser) => (
            <div key={wrappedUser.user.id} className={classes.userChip}>
              <Tooltip
                title={`${wrappedUser.user.name} - ${wrappedUser.address}`}
                classes={{ tooltip: classes.tooltip }}
              >
                <Chip
                  color="primary"
                  label={`${wrappedUser.address.slice(
                    0,
                    4
                  )}...${wrappedUser.address.slice(-4)}`}
                  avatar={<Avatar src={wrappedUser.user.avatarUrl} />}
                  onDelete={() => removeUser(wrappedUser.user.id)}
                  data-testid="additional-user-chip"
                  aria-label={`${wrappedUser.user.name} added with address ${wrappedUser.address}`}
                />
              </Tooltip>
            </div>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          aria-label="Close dialog"
          data-testid="cancel-action-dialog"
          onClick={closeDialog}
        >
          Cancel
        </Button>
        <Button
          aria-label="Invite users on the Ethereum project"
          data-testid="confirm-action-dialog"
          onClick={inviteUsers}
          disabled={isConfirmDisabled}
          className={classes.confirmButton}
        >
          {transactionState.loading ? (
            <CircularProgress size={20} />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageProjectDialog;
