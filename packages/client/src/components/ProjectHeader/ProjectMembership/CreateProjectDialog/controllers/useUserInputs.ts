import { useState, ChangeEvent, useEffect, useRef, useCallback } from "react";
import { ethers } from "ethers";
// Types
import { User } from "types/user";

interface UseUserInputsArgs {
  defaultUser?: User | null;
  defaultAddress?: string | null;
  resetParameter?: any;
}
export interface UseUserInputs {
  userValue: User | null;
  handleUserChange: (event: any, value: User | null) => void;
  addressValue: string;
  handleAddressChange: (event: ChangeEvent<HTMLInputElement>) => void;
  addressError: boolean;
  isConfirmDisabled: boolean;
  reset: () => void;
}
const useUserInputs = ({
  defaultUser,
  defaultAddress,
  resetParameter,
}: UseUserInputsArgs = {}): UseUserInputs => {
  const hasMountedRef = useRef<boolean>(false);
  const [userValue, setUserValue] = useState<User | null>(defaultUser || null);
  const handleUserChange = (event: any, value: User | null) =>
    setUserValue(value);

  const [addressValue, setAddressValue] = useState<string>(
    defaultAddress || ""
  );
  const handleAddressChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>): void => setAddressValue(value);

  const addressError = !isAddress(addressValue);

  const isConfirmDisabled = !userValue || !addressValue || addressError;

  const reset = useCallback((): void => {
    setUserValue(defaultUser || null);
    setAddressValue(defaultAddress || "");
  }, [defaultUser, defaultAddress]);

  useEffect(() => {
    if (hasMountedRef.current) {
      reset();
    }
  }, [resetParameter, reset]);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  return {
    userValue,
    handleUserChange,
    addressValue,
    handleAddressChange,
    addressError,
    isConfirmDisabled,
    reset,
  };
};

export default useUserInputs;

const isAddress = (address: string | null): boolean => {
  if (!address) return true;
  try {
    ethers.utils.getAddress(address);
    return true;
  } catch (err) {
    return false;
  }
};
