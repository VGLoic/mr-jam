import { ethers } from "ethers";
import { useEffect, useReducer, useCallback } from "react";
// Hooks
import { useEthers } from "./";
// Config
import { Contracts, contractMetadatas } from "./config";
import useMemoizedValue from "hooks/useMemoizedValue";

interface UseCallArgs {
  contract: Contracts;
  method: string;
  address?: string;
  args?: any[];
}

interface CallState {
  unable: boolean;
  loading: boolean;
  error: string | null;
  data: any | null;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: CallState = {
  unable: false,
  loading: true,
  error: null,
  data: null,
};

const LOADING = "LOADING_TYPE";
const ERROR = "ERROR_TYPE";
const SUCCESS = "SUCCESS_TYPE";
const UNABLE = "UNABLE_TYPE";

const reducer = (state: CallState, action: Action): CallState => {
  switch (action.type) {
    case LOADING:
      return {
        unable: false,
        loading: true,
        error: null,
        data: state.data,
      };
    case ERROR:
      return {
        unable: false,
        loading: false,
        error: action.payload || "Default error",
        data: null,
      };
    case SUCCESS:
      return {
        unable: false,
        loading: false,
        error: null,
        data: action.payload,
      };
    case UNABLE:
      return {
        unable: true,
        loading: false,
        error: null,
        data: null,
      };
    default:
      throw new Error("Unknow action type");
  }
};

export interface UseCall extends CallState {
  refetch: () => Promise<void>;
}

export const useCall = (hookArgs: UseCallArgs): UseCall => {
  const memoizedHookArgs = useMemoizedValue(hookArgs);

  const { provider } = useEthers();

  const [state, dispatch] = useReducer<
    (state: CallState, action: Action) => CallState
  >(reducer, initialState);

  const call: () => Promise<void> = useCallback(async () => {
    try {
      if (!provider) {
        dispatch({ type: UNABLE });
        return;
      }
      const network: ethers.utils.Network = await provider.getNetwork();
      const contractAddress: string | undefined =
        memoizedHookArgs.address ||
        contractMetadatas[memoizedHookArgs.contract]?.networks?.[
          network.chainId
        ];

      if (!contractAddress) {
        dispatch({
          type: ERROR,
          payload: "No contract address have been found",
        });
        return;
      }
      const contract = new ethers.Contract(
        contractAddress,
        contractMetadatas[memoizedHookArgs.contract].abi,
        provider
      );
      const data: any = memoizedHookArgs.args
        ? await contract[memoizedHookArgs.method](...memoizedHookArgs.args)
        : await contract[memoizedHookArgs.method]();
      dispatch({
        type: SUCCESS,
        payload: data,
      });
    } catch (err) {
      console.error("Error during useCall: ", err);
      dispatch({
        type: ERROR,
        payload: err.message,
      });
    }
  }, [memoizedHookArgs, provider]);

  const refetch: () => Promise<void> = useCallback(async () => {
    dispatch({ type: LOADING });
    await call();
  }, [call, dispatch]);

  useEffect(() => {
    call();
  }, [call]);

  return {
    ...state,
    refetch,
  };
};
