import { ethers } from "ethers";
import { useEffect, useReducer, useCallback } from "react";
// Hooks
import { useMemoizedValue } from "hooks/useMemoizedValue";
import { useEthers } from ".";
// Config
import { Contracts, contractMetadatas } from "./config";


export interface TransactionState {
    unable: boolean;
    loading: boolean;
    error: string | null;
    data: ethers.Contract | null;
}

interface Action {
    type: string;
    payload?: any;
}

const initialState: TransactionState = {
    unable: false,
    loading: false,
    error: null,
    data: null
};

export interface UseTransactionArgs {
    contract: Contracts;
    method: string;
    address?: string;
    args?: any[];
}

export interface UseTransaction extends Array<(() => Promise<void>) | TransactionState>{0: () => Promise<void>; 1: TransactionState};

const LOADING = "LOADING";
const ERROR = "ERROR_TYPE";
const SUCCESS = "SUCCESS_TYPE";
const UNABLE = "UNABLE_TYPE";

const reducer = (state: TransactionState, action: Action): TransactionState => {
    switch (action.type) {
        case LOADING:
            return {
                unable: false,
                loading: true,
                error: null,
                data: null
            };
        case ERROR:
            return {
                unable: false,
                loading: false,
                error: action.payload || "Default error",
                data: null
            };
        case SUCCESS:
            return {
                unable: false,
                loading: false,
                error: null,
                data: action.payload
            };
        case UNABLE:
            return {
                unable: true,
                loading: false,
                error: null,
                data: null
            };
        default:
            throw new Error("Unknow action type");
    }
}

export const useTransaction = (hookArgs: UseTransactionArgs): UseTransaction => {
    const memoizedHookArgs = useMemoizedValue(hookArgs);

    const { provider } = useEthers();

    const [state, dispatch] = useReducer<(state: TransactionState, action: Action) => TransactionState>(reducer, initialState);

    useEffect(() => {
        if (!provider) {
            dispatch({ type: UNABLE });
            return;
        }
    }, [provider]);

    const sendTransaction = useCallback(async (): Promise<void> => {
        if (!provider) return;
        try {
            const network: ethers.utils.Network = await provider.getNetwork();
            const contractAddress: string | undefined = memoizedHookArgs.address || contractMetadatas[memoizedHookArgs.contract]?.networks?.[network.chainId];

            if (!contractAddress) {
                dispatch({
                    type: ERROR,
                    payload: "No contract address have been found"
                });
                return;
            }

            const contract = new ethers.Contract(contractAddress, contractMetadatas[memoizedHookArgs.contract].abi, provider.getSigner());

            const tx = memoizedHookArgs.args
                ? await contract[memoizedHookArgs.method](...memoizedHookArgs.args)
                : await contract[memoizedHookArgs.method]();

            dispatch({
                type: LOADING
            })
            
            const receipt = await tx.wait();
            dispatch({
                type: SUCCESS,
                payload: receipt
            });
        } catch (err) {
            console.error("Error during useTransaction: ", err);
            console.error("Error during useTransaction: ", err.message);
            dispatch({
                type: ERROR,
                payload: err.message
            });
        }
    }, [memoizedHookArgs, provider]);

    return [
        sendTransaction,
        state
    ];
}