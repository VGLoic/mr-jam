import { ethers } from "ethers";
import { useEffect, useReducer } from "react";
// Hooks
import { useEthers } from "./";
// Config
import { Contracts, contractMetadatas } from "./config";
import { useMemoizedValue } from "hooks/useMemoizedValue";

interface UseCallArgs {
    contract: Contracts;
    method: string;
    address?: string;
    args?: any[]
}

interface IState {
    unable: boolean;
    loading: boolean;
    error: string | null;
    data: any | null;
}

interface Action {
    type: string;
    payload?: any;
}

const initialState: IState = {
    unable: false,
    loading: true,
    error: null,
    data: null
};

const ERROR = "ERROR_TYPE";
const SUCCESS = "SUCCESS_TYPE";
const UNABLE = "UNABLE_TYPE";

const reducer = (state: IState, action: Action): IState => {
    switch (action.type) {
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

export const useCall = (hookArgs: UseCallArgs): IState => {
    const memoizedHookArgs = useMemoizedValue(hookArgs);

    const { provider } = useEthers();

    const [state, dispatch] = useReducer<(state: IState, action: Action) => IState>(reducer, initialState);

    useEffect(() => {
        if (!provider) {
            dispatch({ type: UNABLE });
            return;
        }
        const callWrapper = async (): Promise<void> => {
            const network: ethers.utils.Network = await provider.getNetwork();
            const contractAddress: string | undefined = memoizedHookArgs.address || contractMetadatas[memoizedHookArgs.contract]?.networks?.[network.chainId];

            if (!contractAddress) {
                dispatch({
                    type: ERROR,
                    payload: "No contract address have been found"
                });
                return;
            }

            const contract = new ethers.Contract(contractAddress, contractMetadatas[memoizedHookArgs.contract].abi, provider);
            const call: () => Promise<void> = async () => {
                try {
                    const data: any = memoizedHookArgs.args
                        ? await contract[memoizedHookArgs.method](...memoizedHookArgs.args)
                        : await contract[memoizedHookArgs.method]();
                    dispatch({
                        type: SUCCESS,
                        payload: data
                    });
                } catch (err) {
                    dispatch({
                        type: ERROR,
                        payload: err.message
                    })
                }
            }
            call();
        }
        callWrapper();
    }, [memoizedHookArgs, provider, dispatch]);

    return state;
}