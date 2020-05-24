import { ethers } from "ethers";
import { useEffect, useReducer, useCallback } from "react";
// Hooks
import useMemoizedValue from "hooks/useMemoizedValue";
import useEthers from "./useEthers";
// Config
import { Contracts, contractMetadatas } from "./config";

interface DeployState {
  unable: boolean;
  loading: boolean;
  error: string | null;
  data: ethers.Contract | null;
}

interface Action {
  type: string;
  payload?: any;
}

const initialState: DeployState = {
  unable: false,
  loading: false,
  error: null,
  data: null,
};

export interface UseDeployArgs {
  contract: Contracts;
  args?: any[];
}

export interface UseDeploy extends Array<(() => Promise<void>) | DeployState> {
  0: () => Promise<void>;
  1: DeployState;
}

const LOADING = "LOADING";
const ERROR = "ERROR_TYPE";
const SUCCESS = "SUCCESS_TYPE";
const UNABLE = "UNABLE_TYPE";

const reducer = (state: DeployState, action: Action): DeployState => {
  switch (action.type) {
    case LOADING:
      return {
        unable: false,
        loading: true,
        error: null,
        data: null,
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

export const useDeploy = (hookArgs: UseDeployArgs): UseDeploy => {
  const memoizedHookArgs = useMemoizedValue(hookArgs);

  const { provider } = useEthers();

  const [state, dispatch] = useReducer<
    (state: DeployState, action: Action) => DeployState
  >(reducer, initialState);

  useEffect(() => {
    if (!provider) {
      dispatch({ type: UNABLE });
      return;
    }
  }, [provider]);

  const deploy = useCallback(async (): Promise<void> => {
    if (!provider) return;
    try {
      dispatch({
        type: LOADING,
      });
      const { abi, bytecode } = contractMetadatas.Project;
      const factory = new ethers.ContractFactory(
        abi,
        bytecode,
        provider.getSigner()
      );
      const contract = memoizedHookArgs.args
        ? await factory.deploy(...memoizedHookArgs.args)
        : await factory.deploy();
      await contract.deployed();
    } catch (err) {
      console.error("Error during useDeploy: ", err);
      dispatch({
        type: ERROR,
        payload: err.message,
      });
    }
  }, [memoizedHookArgs, provider]);

  return [deploy, state];
};
