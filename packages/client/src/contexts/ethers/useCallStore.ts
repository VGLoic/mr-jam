import { useContext, useCallback } from "react";
import {
  CallStore,
  Key,
  CallPayload,
  CallObject,
  ErrorPayload,
  CallContext,
  ICallStoreContext,
  LOADING,
  SUCCESS,
  ERROR,
} from "./CallStoreProvider";

interface UseCallStore {
  callStore: CallStore;
  loadCall: (key: Key) => void;
  updateCallAsSuccess: (callPayload: CallPayload) => void;
  updateCallAsError: (errorPayload: ErrorPayload) => void;
  getCallObject: (key: Key | null) => CallObject;
}

const defaultObject: CallObject = {
  key: "",
  loading: false,
  error: null,
  data: null,
};

const useCallStore = (): UseCallStore => {
  const context: ICallStoreContext | undefined = useContext(CallContext);
  if (!context) {
    throw new Error(
      "useCallStore must be accessed in a child of the CallStoreProvider."
    );
  }

  const { callStore, dispatch } = context;

  const loadCall = useCallback(
    (key: Key) => {
      dispatch({
        type: LOADING,
        payload: key,
      });
    },
    [dispatch]
  );

  const updateCallAsSuccess = useCallback(
    (callPayload: CallPayload) => {
      dispatch({
        type: SUCCESS,
        payload: callPayload,
      });
    },
    [dispatch]
  );
  const updateCallAsError = useCallback(
    (errorPayload: ErrorPayload) => {
      dispatch({
        type: ERROR,
        payload: errorPayload,
      });
    },
    [dispatch]
  );

  const getCallObject = (key: Key | null): CallObject => {
    if (!key) return defaultObject;
    if (!(key in callStore)) return defaultObject;
    return callStore[key];
  };

  return {
    callStore,
    loadCall,
    updateCallAsSuccess,
    updateCallAsError,
    getCallObject,
  };
};

export default useCallStore;
