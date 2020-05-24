import { useContext, useCallback } from "react";

import {
  TransactionContext,
  ITransactionStoreContext,
  TransactionPayload,
  TransactionStore,
  Key,
  BROADCASTED,
  REVERTED,
  MINED,
  DELETED,
} from "./TransactionStoreProvider";

interface UseTransactionStore {
  transactionStore: TransactionStore;
  broadcastTransaction: (transactionPayload: TransactionPayload) => void;
  updateTransactionAsReverted: (key: Key) => void;
  updateTransactionAsMined: (key: Key) => void;
  deleteTransaction: (key: Key) => void;
}

const useTransactionStore = (): UseTransactionStore => {
  const context: ITransactionStoreContext | undefined = useContext(
    TransactionContext
  );
  if (!context) {
    throw new Error(
      "useTransactionStore must be accessed in a child of the TransactionStoreProvider."
    );
  }

  const { transactionStore, dispatch } = context;

  const broadcastTransaction = useCallback(
    (transactionPayload: TransactionPayload) => {
      dispatch({
        type: BROADCASTED,
        payload: transactionPayload,
      });
    },
    [dispatch]
  );

  const updateTransactionAsReverted = useCallback(
    (key: Key) => {
      dispatch({
        type: REVERTED,
        payload: key,
      });
    },
    [dispatch]
  );

  const updateTransactionAsMined = useCallback(
    (key: Key) => {
      dispatch({
        type: MINED,
        payload: key,
      });
    },
    [dispatch]
  );

  const deleteTransaction = useCallback(
    (key: Key) => {
      dispatch({
        type: DELETED,
        payload: key,
      });
    },
    [dispatch]
  );

  return {
    transactionStore,
    broadcastTransaction,
    updateTransactionAsReverted,
    updateTransactionAsMined,
    deleteTransaction,
  };
};

export default useTransactionStore;
