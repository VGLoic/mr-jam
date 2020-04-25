import React, { createContext, Context, useContext, useState, useEffect } from "react";
import { ethers,  } from "ethers";

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
    provider: ethers.providers.Web3Provider | null
}

const EthersContext: Context<IEthersContext | undefined> = createContext(undefined as IEthersContext | undefined);

type EthersProviderProps = any;

export const allowedNetworks: Record<number, string> = {
    5777: "development"
};

export const METAMASK_ENABLED_KEY: string = "mr-explorer_metamask_enabled";
export const METAMASK_ENABLED_VALUE: string = "yeay";

export const EthersProvider = (props: EthersProviderProps) => {
    const ethereum: Ethereum = (window as any).ethereum || null;

    const isMetaMaskDetected = Boolean(ethereum?.isMetaMask);

    const [isEnabled, setIsEnabled] = useState<boolean>(
        localStorage.getItem(METAMASK_ENABLED_KEY) === METAMASK_ENABLED_VALUE
    );

    const [isNetworkAllowed, setIsNetworkAllowed] = useState<boolean>(
        Boolean(
            ethereum?.networkVersion &&
            ethereum.networkVersion in allowedNetworks
        )
    );

    useEffect((): () => void => {
        const onAccountsChanged = (accounts: string[]): void => {
            if (accounts.length === 0) {
                localStorage.removeItem(METAMASK_ENABLED_KEY);
                setIsEnabled(false);
            }
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

    const value: IEthersContext = {
        ethereum,
        isMetaMaskDetected,
        isEnabled,
        setIsEnabled,
        isNetworkAllowed,
        provider
    };

    return <EthersContext.Provider value={value} {...props} />
}

export interface UseEthers {
    isMetaMaskDetected: boolean;
    isEnabled: boolean;
    enableMetaMask: () => Promise<void>;
    isNetworkAllowed: boolean;
    provider: ethers.providers.Web3Provider | null;
}

export const useEthers = (): UseEthers => {
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
            console.error("User has canceled the connection request. MetaMask error: ", err);
            localStorage.removeItem(METAMASK_ENABLED_KEY);
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