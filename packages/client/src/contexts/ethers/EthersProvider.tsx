import React, { createContext, Context, useState, useEffect } from "react";
import { ethers } from "ethers";
import { allowedNetworks } from "./config";

export interface IEthereum {
  isMetaMask: boolean;
  networkVersion: string;
  selectedAddress: string | null;
  enable: () => Promise<void>;
  on: (eventName: string, callback: (args: any) => any) => void;
  removeListener: (eventName: string, callback: (args: any) => any) => void;
}

type Ethereum = IEthereum | null;

export interface IEthersContext {
  ethereum: Ethereum;
  isMetaMaskDetected: boolean;
  isEnabled: boolean;
  setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isNetworkAllowed: boolean;
  provider: ethers.providers.Web3Provider | null;
  selectedAddress: string | null;
}

export const METAMASK_ENABLED_KEY: string = "mr-explorer_metamask_enabled";
export const METAMASK_ENABLED_VALUE: string = "yeay";

export const EthersContext: Context<IEthersContext | undefined> = createContext(
  undefined as IEthersContext | undefined
);

type EthersProviderProps = any;
const EthersProvider = (props: EthersProviderProps) => {
  const ethereum: Ethereum = (window as any).ethereum || null;

  const isMetaMaskDetected = Boolean(ethereum?.isMetaMask);

  const [isEnabled, setIsEnabled] = useState<boolean>(
    localStorage.getItem(METAMASK_ENABLED_KEY) === METAMASK_ENABLED_VALUE
  );

  const [isNetworkAllowed, setIsNetworkAllowed] = useState<boolean>(
    Boolean(
      ethereum?.networkVersion && ethereum.networkVersion in allowedNetworks
    )
  );

  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    ethereum?.selectedAddress || null
  );

  useEffect((): (() => void) => {
    const onAccountsChanged = (accounts: string[]): void => {
      if (accounts.length === 0) {
        localStorage.removeItem(METAMASK_ENABLED_KEY);
        setIsEnabled(false);
        return;
      }
      setSelectedAddress(accounts[0]);
    };
    const onNetworkChanged = (networkId: number): void => {
      setIsNetworkAllowed(networkId in allowedNetworks);
    };
    ethereum?.on("accountsChanged", onAccountsChanged);
    ethereum?.on("networkChanged", onNetworkChanged);
    return () => {
      ethereum?.removeListener("accountsChanged", onAccountsChanged);
      ethereum?.removeListener("networkChanged", onNetworkChanged);
    };
  }, [ethereum]);

  const provider =
    ethereum && isEnabled && isNetworkAllowed
      ? new ethers.providers.Web3Provider(ethereum)
      : null;

  const value: IEthersContext = {
    ethereum,
    isMetaMaskDetected,
    isEnabled,
    setIsEnabled,
    isNetworkAllowed,
    provider,
    selectedAddress,
  };

  return <EthersContext.Provider value={value} {...props} />;
};

export default EthersProvider;
