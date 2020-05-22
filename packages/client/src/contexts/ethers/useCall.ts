import { ethers } from "ethers";
import { useEffect, useReducer, useCallback, useRef } from "react";
// Hooks
import { useEthers } from "./";
import useMemoizedValue from "hooks/useMemoizedValue";
// Config
import { Contracts, contractMetadatas } from "./config";

interface UseCallArgs {
  contract: Contracts;
  method: string;
  address?: string;
  args?: any[];
  manual?: boolean;
  delayCondition?: boolean;
}

interface CallState<T> {
  unable: boolean;
  loading: boolean;
  error: string | null;
  data: T | null;
}

interface Action {
  type: string;
  payload?: any;
}

const buildInitialState = <T>(hookArgs: UseCallArgs): CallState<T> => {
  if (hookArgs.manual) {
    return {
      unable: false,
      loading: false,
      error: null,
      data: null,
    };
  }
  return {
    unable: false,
    loading: !hookArgs.delayCondition,
    error: null,
    data: null,
  };
};

const LOADING = "LOADING_TYPE";
const ERROR = "ERROR_TYPE";
const SUCCESS = "SUCCESS_TYPE";
const UNABLE = "UNABLE_TYPE";
const RESET = "RESET_TYPE";

const reducer = <T>(state: CallState<T>, action: Action): CallState<T> => {
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
    case RESET:
      return {
        unable: false,
        loading: false,
        error: null,
        data: null,
      };
    default:
      throw new Error("Unknow action type");
  }
};

export interface UseCall<T> extends CallState<T> {
  refetch: () => Promise<void>;
}

export const useCall = <T>(hookArgs: UseCallArgs): UseCall<T> => {
  const isMountedRef = useRef<boolean | null>(null);
  const memoizedHookArgs = useMemoizedValue(hookArgs);

  const { provider } = useEthers();

  const [state, dispatch] = useReducer<
    (state: CallState<T>, action: Action) => CallState<T>
  >(reducer, buildInitialState(hookArgs));

  const call: () => Promise<void> = useCallback(async () => {
    try {
      if (!provider) {
        dispatch({ type: UNABLE });
        return;
      }
      dispatch({ type: LOADING });
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
      if (!isMountedRef.current) return;
      dispatch({
        type: SUCCESS,
        payload: data,
      });
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Error during useCall: ", err);
      dispatch({
        type: ERROR,
        payload: err.message,
      });
    }
  }, [memoizedHookArgs, provider]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  });

  useEffect(() => {
    if (!memoizedHookArgs.manual && !memoizedHookArgs.delayCondition) {
      call();
    }
    return () => {
      dispatch({
        type: RESET,
      });
    };
  }, [call, memoizedHookArgs]);

  return {
    ...state,
    refetch: call,
  };
};
