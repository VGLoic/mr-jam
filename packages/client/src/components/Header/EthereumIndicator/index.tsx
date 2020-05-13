import React from "react";
import classnames from "classnames";
// UI Components
import { Tooltip, IconButton, SvgIcon } from "@material-ui/core";
import { mdiEthereum } from "@mdi/js";
// Hooks
import { useEthers } from "contexts/ethers";
import { allowedNetworks } from "contexts/ethers/config";
// Styles
import { useStyles } from "./styles";

const networkString = Object.entries(allowedNetworks).reduce(
  (acc: string, [networkId, networkName]): string => {
    const networkAddition = `${networkName} (ID ${networkId})`;
    if (acc) {
      return `${acc}, ${networkAddition}`;
    }
    return networkAddition;
  },
  ""
);

const EthereumIndicator = () => {
  const {
    isMetaMaskDetected,
    isEnabled,
    enableMetaMask,
    isNetworkAllowed,
  } = useEthers();

  const classes = useStyles();

  if (!isMetaMaskDetected) {
    return (
      <Tooltip title="MetaMask extension is needed in order to use blockchain features.">
        <SvgIcon
          aria-label="MetaMask extension is needed in order to use blockchain features."
          className={classnames(classes.notFound, classes.aloneIcon)}
        >
          <path d={mdiEthereum} />
        </SvgIcon>
      </Tooltip>
    );
  }

  if (!isEnabled) {
    return (
      <Tooltip title="Enable MetaMask">
        <IconButton
          data-testid="enable-metamask-button"
          aria-label="Enable MetaMask"
          onClick={enableMetaMask}
        >
          <SvgIcon className={classes.notEnabled}>
            <path d={mdiEthereum} />
          </SvgIcon>
        </IconButton>
      </Tooltip>
    );
  }

  if (!isNetworkAllowed) {
    return (
      <Tooltip
        title={`Please, change on one of the allowed following networks ${networkString}.`}
      >
        <SvgIcon
          aria-label={`Please, change on one of the following networks ${networkString}.`}
          className={classnames(classes.wrongNetwork, classes.aloneIcon)}
        >
          <path d={mdiEthereum} />
        </SvgIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip title="MetaMask is properly setup">
      <SvgIcon
        aria-label="MetaMask is properly setup"
        className={classnames(classes.correctNetwork, classes.aloneIcon)}
      >
        <path d={mdiEthereum} />
      </SvgIcon>
    </Tooltip>
  );
};

export default EthereumIndicator;
