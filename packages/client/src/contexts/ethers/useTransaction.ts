import { ethers } from "ethers";
import { useEffect, useReducer, useCallback } from "react";
// Hooks
import useMemoizedValue from "hooks/useMemoizedValue";
import useEthers from "./useEthers";
import useTransactionStore from "./useTransactionStore";
import useMountedRef from "./useMountedRef";
// Config
import { Contracts, contractMetadatas } from "./config";
import { ContractTransaction, Contract } from "ethers/contract";

export interface TransactionState {
  unable: boolean;
  loading: boolean;
  error: string | null;
  data: string | null;
}

interface Action {
  type: string;
  payload?: string;
}

const initialState: TransactionState = {
  unable: false,
  loading: false,
  error: null,
  data: null,
};

export interface UseTransactionArgs {
  key: string;
  description?: string;
  contract: Contracts;
  method: string;
  address?: string;
  args?: any[];
  onBroadcast?: Function;
  onMined?: Function;
}

export interface UseTransaction
  extends Array<(() => Promise<void>) | TransactionState> {
  0: () => Promise<void>;
  1: TransactionState;
}

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
        data: action.payload as string,
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

const useTransaction = (hookArgs: UseTransactionArgs): UseTransaction => {
  const memoizedHookArgs = useMemoizedValue(hookArgs);
  const isMountedRef = useMountedRef();

  const { provider } = useEthers();
  const {
    broadcastTransaction,
    updateTransactionAsMined,
    updateTransactionAsReverted,
  } = useTransactionStore();

  const [state, dispatch] = useReducer<
    (state: TransactionState, action: Action) => TransactionState
  >(reducer, initialState);

  useEffect(() => {
    if (!provider) {
      dispatch({ type: UNABLE });
    }
  }, [provider]);

  const handleTransaction = useCallback(
    async (tx: ContractTransaction): Promise<void> => {
      broadcastTransaction({
        key: memoizedHookArgs.key,
        description: memoizedHookArgs.description,
        hash: tx.hash as string,
      });

      try {
        await tx.wait();
      } catch (err) {
        console.error(
          "useTransaction: transaction has been reverted. Stack error: ",
          err
        );
        updateTransactionAsReverted(memoizedHookArgs.key);
        return;
      }

      updateTransactionAsMined(memoizedHookArgs.key);

      if (memoizedHookArgs.onMined) {
        try {
          await memoizedHookArgs.onMined();
        } catch (err) {
          console.error(
            "useTransaction: onMined callback has failed. Stack error: ",
            err
          );
        }
      }
    },
    [
      memoizedHookArgs,
      broadcastTransaction,
      updateTransactionAsMined,
      updateTransactionAsReverted,
    ]
  );

  const sendTransaction = useCallback(async (): Promise<void> => {
    if (!provider) return;
    dispatch({
      type: LOADING,
    });

    let network: ethers.utils.Network;
    try {
      network = await provider.getNetwork();
    } catch (err) {
      console.error(
        "useTransaction: unable to get the network. Stack error: ",
        err
      );
      if (!isMountedRef) return;
      dispatch({
        type: ERROR,
        payload: "Unable to select the current network",
      });
      return;
    }

    const contractAddress: string | undefined =
      memoizedHookArgs.address ||
      contractMetadatas[memoizedHookArgs.contract]?.networks?.[network.chainId];

    if (!contractAddress) {
      console.error("useTransaction: no contract address has been found.");
      dispatch({
        type: ERROR,
        payload: "No contract address have been found",
      });
      return;
    }

    let ethersContract: Contract;
    try {
      ethersContract = new Contract(
        contractAddress,
        contractMetadatas[memoizedHookArgs.contract].abi,
        provider.getSigner()
      );
    } catch (err) {
      console.error(
        "useTransaction: unable to build the contract. Stack error: ",
        err
      );
      dispatch({
        type: ERROR,
        payload: "Unable to build the contract from abi, address and signer",
      });
      return;
    }

    let tx: ContractTransaction;
    try {
      tx = memoizedHookArgs.args
        ? await ethersContract[memoizedHookArgs.method](
            ...memoizedHookArgs.args
          )
        : await ethersContract[memoizedHookArgs.method]();
    } catch (err) {
      console.error(
        "useTransaction: unable to broadcast the transaction. Stack error: ",
        err
      );
      if (!isMountedRef) return;
      dispatch({
        type: ERROR,
        payload: "Unable to broadcast the transaction",
      });
      return;
    }

    if (!tx.hash) {
      console.error("useTransaction: no transaction hash has been found.");
      if (!isMountedRef) return;
      dispatch({
        type: ERROR,
        payload: "No transaction hash has been found",
      });
      return;
    }

    handleTransaction(tx);

    if (memoizedHookArgs.onBroadcast) {
      try {
        await memoizedHookArgs.onBroadcast();
      } catch (err) {
        console.error(
          "useTransaction: onBroadcast callback has failed. Stack error: ",
          err
        );
        if (!isMountedRef) return;
        dispatch({
          type: ERROR,
          payload: "onBroadcast callback has failed",
        });
        return;
      }
    }

    if (isMountedRef) {
      dispatch({
        type: SUCCESS,
        payload: tx.hash,
      });
    }
  }, [memoizedHookArgs, provider, isMountedRef, handleTransaction]);

  return [sendTransaction, state];
};

export default useTransaction;
