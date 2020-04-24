import React from "react";
import classnames from "classnames";
// UI Components
import {
    Tooltip,
    IconButton,
    SvgIcon,
    Typography,
    Box
} from "@material-ui/core";
import { mdiEthereum, mdiAlert } from "@mdi/js";
// Hooks
import { useEthers, allowedNetworks } from "contexts/ethers";
// Styles
import { useStyles } from "./styles";

const networkString = Object.entries(allowedNetworks).reduce(
    (acc: string, [networkId, networkName]): string => {
        const networkAddition = `${networkName} (id ${networkId})`;
        if (acc) {
            return `${acc}, ${networkAddition}`;
        }
        return networkAddition;
    },
    ""
);

const EthereumIndicator = () => {
    const { isMetaMaskDetected, isEnabled, enableMetaMask, isNetworkAllowed } = useEthers();

    const classes = useStyles();

    if (!isEnabled) {
        return (
            <Tooltip
                title="Enable MetaMask"
            >
                <IconButton
                data-testid="enable-metamask-button"
                aria-label="Enable MetaMask"
                onClick={enableMetaMask}
                disabled={!isMetaMaskDetected}
                >
                    <SvgIcon>
                        <path d={mdiEthereum} />
                    </SvgIcon>
                </IconButton>
            </Tooltip>
        )
    }
    if (!isNetworkAllowed) {
        return (
            <Tooltip
                title={`Please, change on one of the following networks ${networkString}.`}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    className={classes.networkBadgeContainer}
                >
                    <SvgIcon
                        fontSize="inherit"
                        className={classnames(classes.networkBadgeContent, classes.networkBadgeIcon)}
                    >
                        <path d={mdiAlert} />
                    </SvgIcon>
                    <Typography className={classes.networkBadgeContent} variant="caption">
                        Network not allowed
                    </Typography>
                </Box>
            </Tooltip>
        )
    }

    return null;
}

export default EthereumIndicator;