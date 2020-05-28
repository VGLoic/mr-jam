import { useContext } from "react";
import { ethers } from "ethers";
import {
  IEthersContext,
  EthersContext,
  METAMASK_ENABLED_KEY,
  METAMASK_ENABLED_VALUE,
} from "./EthersProvider";

export interface UseEthers {
  isMetaMaskDetected: boolean;
  isEnabled: boolean;
  enableMetaMask: () => Promise<void>;
  networkId: string | null;
  isNetworkAllowed: boolean;
  provider: ethers.providers.Web3Provider | null;
  selectedAddress: string | null;
}

const useEthers = (): UseEthers => {
  const context: IEthersContext | undefined = useContext(EthersContext);

  if (!context) {
    throw new Error(
      "useEthers must be accessed in a child of the EthersProvider."
    );
  }

  const enableMetaMask = async (): Promise<void> => {
    try {
      await context.ethereum?.enable();
      context.setIsEnabled(true);
      localStorage.setItem(METAMASK_ENABLED_KEY, METAMASK_ENABLED_VALUE);
    } catch (err) {
      console.error(
        "User has canceled the connection request. MetaMask error: ",
        err
      );
      localStorage.removeItem(METAMASK_ENABLED_KEY);
    }
  };

  return {
    isMetaMaskDetected: context.isMetaMaskDetected,
    isEnabled: context.isEnabled,
    enableMetaMask,
    networkId: context.networkId,
    isNetworkAllowed: context.isNetworkAllowed,
    provider: context.provider,
    selectedAddress: context.selectedAddress,
  };
};

export default useEthers;
