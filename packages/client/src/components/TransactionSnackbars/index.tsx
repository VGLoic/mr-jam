import React, { useState } from "react";
// Hooks
import useTransactionStore from "contexts/ethers/useTransactionStore";
// Types
import {
  TransactionObject,
  Key,
} from "contexts/ethers/TransactionStoreProvider";
import { BROADCASTED, REVERTED, MINED } from "contexts/ethers";
// UI Components
import { Snackbar, Box } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
// Styles
import { useStyles } from "./styles";

interface TransactionSnackbarProps {
  transaction: TransactionObject;
  deleteTransaction: (key: Key) => void;
  index: number;
}
const TransactionSnackbar = ({
  transaction,
  deleteTransaction,
  index,
}: TransactionSnackbarProps) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles({ index });

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    deleteTransaction(transaction.key);
  };
  const autoHideDuration = transaction.state === BROADCASTED ? null : 6000;
  const severity =
    transaction.state === BROADCASTED
      ? "info"
      : transaction.state === MINED
      ? "success"
      : transaction.state === REVERTED
      ? "error"
      : "warning";
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      key={transaction.key}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      classes={{ anchorOriginBottomRight: classes.snackbar }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {transaction.description}
      </Alert>
    </Snackbar>
  );
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const TransactionSnackbars = () => {
  const { transactionStore, deleteTransaction } = useTransactionStore();
  const transactions = Object.values(transactionStore);

  return (
    <Box display="flex" flexDirection="column">
      {transactions.map((transaction, index) => (
        <TransactionSnackbar
          key={transaction.key}
          transaction={transaction}
          deleteTransaction={deleteTransaction}
          index={index}
        />
      ))}
    </Box>
  );
};

export default TransactionSnackbars;
