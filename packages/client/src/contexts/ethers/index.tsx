import React, { createContext, Context, useContext, useState, useEffect } from "react";
import { ethers,  } from "ethers";

interface IEthereum {
    isMetaMask: boolean;
    selectedAddress: string | null;
    enable: () => Promise<void>;
    on: (eventName: string, callback: (args: any) => any) => void;
    removeListener: (eventName: string, callback: (args: any) => any) => void;
}

type Ethereum = IEthereum | null;

interface IContext {
    ethereum: Ethereum;
    isMetaMaskDetected: boolean;
    isEnabled: boolean;
    setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isNetworkAllowed: boolean;
    provider: ethers.providers.Web3Provider | null
}

const EthersContext: Context<IContext | undefined> = createContext(undefined as IContext | undefined);

type EthersProviderProps = any;

export const allowedNetworks: Record<number, string> = {
    5777: "development"
};

export const EthersProvider = (props: EthersProviderProps) => {
    const ethereum: Ethereum = (window as any).ethereum || null;

    const isMetaMaskDetected = Boolean(ethereum?.isMetaMask);

    const [isEnabled, setIsEnabled] = useState<boolean>(false);
    const [isNetworkAllowed, setIsNetworkAllowed] = useState<boolean>(false);

    useEffect((): () => void => {
        const onAccountsChanged = (accounts: string[]): void => {
            if (accounts.length === 0) setIsEnabled(false);
        }
        const onNetworkChanged = (networkId: number): void => {
            setIsNetworkAllowed(networkId in allowedNetworks);
        };
        ethereum?.on("accountsChanged", onAccountsChanged);
        ethereum?.on("networkChanged", onNetworkChanged);
        return () => {
            ethereum?.removeListener("accountsChanged", onAccountsChanged);
            ethereum?.removeListener("networkChanged", onNetworkChanged);
        }
    }, [ethereum]);

    const provider = ethereum ? new ethers.providers.Web3Provider(ethereum) : null;

    const value: IContext = {
        ethereum,
        isMetaMaskDetected,
        isEnabled,
        setIsEnabled,
        isNetworkAllowed,
        provider
    };

    return <EthersContext.Provider value={value} {...props} />
}

interface UseEthers {
    isMetaMaskDetected: boolean;
    isEnabled: boolean;
    enableMetaMask: () => Promise<void>;
    isNetworkAllowed: boolean;
    provider: ethers.providers.Web3Provider | null;
}

export const useEthers = (): UseEthers => {
    const context: IContext | undefined = useContext(EthersContext);

    if (!context) {
        throw new Error(
          "useEthers must be accessed in a child of the EthersProvider."
        );
    }

    const enableMetaMask = async (): Promise<void> => {
        try {
            await context.ethereum?.enable();
            context.setIsEnabled(true);
        } catch (err) {
            console.error("User has canceled the connection request. MetaMask error: ", err);
        }
    }

    return {
        isMetaMaskDetected: context.isMetaMaskDetected,
        isEnabled: context.isEnabled,
        enableMetaMask,
        isNetworkAllowed: context.isNetworkAllowed,
        provider: context.provider
    };
}