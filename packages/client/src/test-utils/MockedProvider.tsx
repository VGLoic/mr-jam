import React from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ethers } from "ethers";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "contexts/theme";
import EthersProvider, { IEthersContext } from "contexts/ethers/EthersProvider";
import TransactionStoreProvider from "contexts/ethers/TransactionStoreProvider";
import CallStoreProvider from "contexts/ethers/CallStoreProvider";

const mockProvider: any = {
  getNetwork: () => 1,
};

const defaultMockEthersContext: IEthersContext = {
  ethereum: {
    isMetaMask: true,
    networkVersion: "1",
    selectedAddress: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
    enable: () => Promise.resolve(),
    on: () => {},
    removeListener: () => {},
  },
  isMetaMaskDetected: true,
  isEnabled: true,
  setIsEnabled: () => {},
  isNetworkAllowed: true,
  networkId: "1",
  provider: mockProvider as ethers.providers.Web3Provider,
  selectedAddress: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
};

export interface MockedProviderProps {
  children?: React.ReactElement;
  ethersContext?: IEthersContext;
}
const MockedProvider = ({ children, ethersContext }: MockedProviderProps) => {
  const ethersProviderProps: any = {};
  if (ethersContext !== null)
    ethersProviderProps.value = {
      ...defaultMockEthersContext,
      ...ethersContext,
    };

  return (
    <EthersProvider {...ethersProviderProps}>
      <TransactionStoreProvider>
        <CallStoreProvider>
          <Router>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <CssBaseline />
              <ThemeProvider>{children}</ThemeProvider>
            </MuiPickersUtilsProvider>
          </Router>
        </CallStoreProvider>
      </TransactionStoreProvider>
    </EthersProvider>
  );
};

export default MockedProvider;
