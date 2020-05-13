import { useState } from "react";
import { ethers } from "ethers";
// Hooks
import {
  useTransaction,
  TransactionState,
} from "contexts/ethers/useTransaction";
import useUser from "hooks/useUser";
import { useEthers } from "contexts/ethers";
// Config
import { Contracts } from "contexts/ethers/config";
// Types
import useUserInputs, { UseUserInputs } from "./useUserInputs";
import { User } from "types/user";

interface WrappedUser {
  user: User;
  address: string;
}

interface UseCreateProjectArgs {
  projectName: string;
  updateProjectAddress: () => Promise<void>;
  closeDialog: () => void;
}
interface UseCreateProject {
  unable: boolean;
  adminUserInputContext: UseUserInputs;
  additionalUserInputContext: UseUserInputs;
  additionalUsers: WrappedUser[];
  addUser: () => void;
  removeUser: (userId: string) => void;
  transactionState: TransactionState;
  createProject: () => Promise<void>;
  isConfirmDisabled: boolean;
}
const useCreateProject = ({
  projectName,
  updateProjectAddress,
  closeDialog,
}: UseCreateProjectArgs): UseCreateProject => {
  const { data: user } = useUser();
  const { selectedAddress, isEnabled } = useEthers();

  const adminUserInputContext = useUserInputs({
    defaultUser: user,
    defaultAddress: selectedAddress,
  });
  const additionalUserInputContext = useUserInputs({
    resetParameter: projectName,
  });

  const [additionalUsers, setAdditionalUsers] = useState<
    Map<string, WrappedUser>
  >(new Map());

  const addUser = (): void => {
    setAdditionalUsers((currentUsers) => {
      if (additionalUserInputContext.isConfirmDisabled) return currentUsers;
      const user = additionalUserInputContext.userValue as User;
      currentUsers.set(user.id, {
        user,
        address: additionalUserInputContext.addressValue,
      });
      return currentUsers;
    });
    additionalUserInputContext.reset();
  };

  const removeUser = (userId: string): void => {
    setAdditionalUsers((currentUsers) => {
      // Need to do a copy because React does not like too much Map
      // Delete does not trigger a rerender
      const updatedAdditionalUsers = new Map(currentUsers);
      updatedAdditionalUsers.delete(userId);
      return updatedAdditionalUsers;
    });
  };

  const [sendTransaction, transactionState] = useTransaction({
    contract: Contracts.ProjectRegistry,
    method: "registerProject",
    args: [
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(projectName.toUpperCase())
      ),
      adminUserInputContext.addressValue,
      adminUserInputContext.userValue?.id,
      Array.from(additionalUsers.values()).map(
        (wrappedUser) => wrappedUser.address
      ),
      Array.from(additionalUsers.values()).map(
        (wrappedUser) => wrappedUser.user.id
      ),
    ],
  });

  const createProject = async () => {
    await sendTransaction();
    await updateProjectAddress();
    closeDialog();
  };

  const isConfirmDisabled =
    adminUserInputContext.isConfirmDisabled || transactionState.loading;

  return {
    unable: !isEnabled,
    adminUserInputContext,
    additionalUserInputContext,
    additionalUsers: Array.from(additionalUsers.values()),
    addUser,
    removeUser,
    transactionState,
    createProject,
    isConfirmDisabled,
  };
};

export default useCreateProject;
