import React, { createContext, Context, useReducer } from "react";

enum TransactionState {
  Broadcasted = "BROADCASTED",
  Reverted = "REVERTED",
  Mined = "MINED",
}
export type Key = string;
export interface TransactionPayload {
  key: Key;
  description?: string;
  hash: string;
}
export interface TransactionObject extends TransactionPayload {
  state: TransactionState;
}
export type TransactionStore = Record<Key, TransactionObject>;

export const BROADCASTED = "BROADCASTED";
interface BroadcastAction {
  type: typeof BROADCASTED;
  payload: TransactionPayload;
}
export const REVERTED = "REVERTED";
interface RevertAction {
  type: typeof REVERTED;
  payload: Key;
}
export const MINED = "MINED";
interface MinedAction {
  type: typeof MINED;
  payload: Key;
}
export const DELETED = "DELETED";
interface DeletedAction {
  type: typeof DELETED;
  payload: Key;
}
type Action = BroadcastAction | RevertAction | MinedAction | DeletedAction;
const initialState: TransactionStore = {};

const reducer = (state: TransactionStore, action: Action): TransactionStore => {
  let transactionObject: TransactionObject | undefined;
  switch (action.type) {
    case BROADCASTED:
      return {
        ...state,
        [action.payload.key]: {
          ...action.payload,
          state: TransactionState.Broadcasted,
        },
      };
    case REVERTED:
      transactionObject = state[action.payload];
      if (!transactionObject) {
        console.warn(
          "A non existing transaction has been indicated as reverted"
        );
        return state;
      }
      return {
        ...state,
        [action.payload]: {
          ...transactionObject,
          state: TransactionState.Reverted,
        },
      };
    case MINED:
      transactionObject = state[action.payload];
      if (!transactionObject) {
        console.warn("A non existing transaction has been indicated as mined");
        return state;
      }
      return {
        ...state,
        [action.payload]: {
          ...transactionObject,
          state: TransactionState.Mined,
        },
      };
    case DELETED:
      transactionObject = state[action.payload];
      if (!transactionObject) {
        console.warn(
          "A non existing transaction has been indicated as deleted"
        );
        return state;
      }
      const updatedState = { ...state };
      delete updatedState[action.payload];
      return updatedState;
    default:
      throw new Error("Unknown action type");
  }
};

export interface ITransactionStoreContext {
  transactionStore: TransactionStore;
  dispatch: React.Dispatch<Action>;
}

export const TransactionContext: Context<
  ITransactionStoreContext | undefined
> = createContext(undefined as ITransactionStoreContext | undefined);

type TransactionStoreProviderProps = any;
const TransactionStoreProvider = (props: TransactionStoreProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: ITransactionStoreContext = {
    transactionStore: state,
    dispatch,
  };

  return <TransactionContext.Provider value={value} {...props} />;
};

export default TransactionStoreProvider;
