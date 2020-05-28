import React, { createContext, useReducer, Context } from "react";

export type Key = string;

export interface CallObject {
  key: Key;
  loading: boolean;
  error: string | null;
  data: any | null;
}
export type CallStore = Record<Key, CallObject>;

export const LOADING = "LOADING";
interface LoadingAction {
  type: typeof LOADING;
  payload: Key;
}
export const SUCCESS = "SUCCESS";
export interface CallPayload {
  key: Key;
  data: any;
}
interface SuccessAction {
  type: typeof SUCCESS;
  payload: CallPayload;
}
export const ERROR = "ERROR";
export interface ErrorPayload {
  key: Key;
  error: string;
}
interface ErrorAction {
  type: typeof ERROR;
  payload: ErrorPayload;
}

type Action = LoadingAction | SuccessAction | ErrorAction;
const initialState: CallStore = {};

const reducer = (state: CallStore, action: Action): CallStore => {
  let callObject: CallObject | undefined;
  switch (action.type) {
    case LOADING:
      callObject = state[action.payload];
      if (callObject) {
        return {
          ...state,
          [action.payload]: {
            ...callObject,
            loading: true,
          },
        };
      }
      return {
        ...state,
        [action.payload]: {
          key: action.payload,
          loading: true,
          error: null,
          data: null,
        },
      };
    case SUCCESS:
      callObject = state[action.payload.key];
      if (!callObject) return state;
      return {
        ...state,
        [action.payload.key]: {
          ...callObject,
          loading: false,
          data: action.payload.data,
        },
      };
    case ERROR:
      callObject = state[action.payload.key];
      if (!callObject) return state;
      return {
        ...state,
        [action.payload.key]: {
          ...callObject,
          loading: false,
          error: action.payload.error,
        },
      };
    default:
      throw new Error("Unknown action type");
  }
};

export interface ICallStoreContext {
  callStore: CallStore;
  dispatch: React.Dispatch<Action>;
}

export const CallContext: Context<
  ICallStoreContext | undefined
> = createContext(undefined as ICallStoreContext | undefined);

type CallStoreProviderProps = any;
const CallStoreProvider = (props: CallStoreProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value: ICallStoreContext = {
    callStore: state,
    dispatch,
  };

  return <CallContext.Provider value={value} {...props} />;
};

export default CallStoreProvider;
