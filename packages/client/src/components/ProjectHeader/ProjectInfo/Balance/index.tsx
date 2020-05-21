import React from "react";
// UI Components
import { Typography } from "@material-ui/core";

interface BalanceProps {
  balance: number;
}
const Balance = ({ balance }: BalanceProps) => {
  return (
    <Typography color="textPrimary" variant="button">
      {balance} Tokens
    </Typography>
  );
};

export default Balance;
