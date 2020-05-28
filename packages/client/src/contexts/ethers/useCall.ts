import { ethers, Contract } from "ethers";
import { useEffect, useCallback } from "react";
// Hooks
import useEthers from "./useEthers";
import useMemoizedValue from "hooks/useMemoizedValue";
// Config
import { Contracts, contractMetadatas } from "./config";
import useCallStore from "./useCallStore";
import { Web3Provider } from "ethers/providers";

interface UseCallArgs {
  contract: Contracts;
  method: string;
  address?: string;
  args?: any[];
  manual?: boolean;
  delayCondition?: boolean;
}

const buildKey = (
  contract: string,
  contractAddress: string,
  method: string,
  args?: any[]
) => {
  return JSON.stringify({
    contract,
    contractAddress,
    method,
    args,
  });
};

export interface UseCall<T> {
  unable: boolean;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  data: T | null;
  refetch: () => Promise<void>;
}

export const useCall = <T>(hookArgs: UseCallArgs): UseCall<T> => {
  const memoizedHookArgs = useMemoizedValue(hookArgs);

  const { provider, networkId } = useEthers();

  const {
    getCallObject,
    loadCall,
    updateCallAsError,
    updateCallAsSuccess,
  } = useCallStore();

  const contractAddress: string | null =
    memoizedHookArgs.address ||
    (networkId &&
      contractMetadatas[memoizedHookArgs.contract]?.networks?.[networkId]) ||
    null;

  const unable: boolean = !provider || !contractAddress;

  const key = contractAddress
    ? buildKey(
        memoizedHookArgs.contract,
        contractAddress,
        memoizedHookArgs.method,
        memoizedHookArgs.args
      )
    : null;

  const callObject = getCallObject(key);

  const call: () => Promise<void> = useCallback(async () => {
    if (unable || !key) return;
    loadCall(key);

    let contract: Contract;
    try {
      contract = new ethers.Contract(
        contractAddress as string,
        contractMetadatas[memoizedHookArgs.contract].abi,
        provider as Web3Provider
      );
    } catch (err) {
      console.error(
        "useCall: Unable to create the contract. Detailed error: ",
        err
      );
      updateCallAsError({
        key,
        error: "useCall: Unable to create the contract",
      });
      return;
    }

    let data: T;
    try {
      data = memoizedHookArgs.args
        ? await contract[memoizedHookArgs.method](...memoizedHookArgs.args)
        : await contract[memoizedHookArgs.method]();
    } catch (err) {
      console.error(
        "useCall: Error during call to the blockchain. Detailed error: ",
        err
      );
      updateCallAsError({
        key,
        error: "useCall: Error during call to the blockchain",
      });
      return;
    }

    updateCallAsSuccess({ key, data });
  }, [
    contractAddress,
    key,
    loadCall,
    memoizedHookArgs.args,
    memoizedHookArgs.contract,
    memoizedHookArgs.method,
    provider,
    unable,
    updateCallAsError,
    updateCallAsSuccess,
  ]);

  useEffect(() => {
    if (
      !unable &&
      !memoizedHookArgs.manual &&
      !memoizedHookArgs.delayCondition
    ) {
      call();
    }
  }, [call, memoizedHookArgs, unable]);

  return {
    unable,
    refreshing: callObject.loading && callObject.data,
    loading: callObject.loading && !callObject.data,
    error: callObject.error,
    data: callObject.data as T | null,
    refetch: call,
  };
};
