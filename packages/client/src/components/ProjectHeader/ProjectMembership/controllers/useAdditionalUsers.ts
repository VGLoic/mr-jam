import { useState } from "react";
// Hooks and Types
import useUserInputs, { UseUserInputs } from "./useUserInputs";
// Types
import { User } from "types/user";

interface WrappedUser {
  user: User;
  address: string;
}

interface UseAdditionalUsersArgs {
  resetParameter: any;
  addressBlackList?: string[];
  idBlackList?: string[];
}

export interface UseAdditionalUsers {
  additionalUserInputContext: UseUserInputs;
  additionalUsers: WrappedUser[];
  addUser: () => void;
  removeUser: (userId: string) => void;
  reset: () => void;
}

const useAdditionalUsers = ({
  resetParameter,
  addressBlackList,
  idBlackList,
}: UseAdditionalUsersArgs): UseAdditionalUsers => {
  const additionalUserInputContext = useUserInputs({
    resetParameter,
    addressBlackList,
    idBlackList,
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

  const reset = (): void => {
    additionalUserInputContext.reset();
    setAdditionalUsers(new Map());
  };

  return {
    additionalUserInputContext,
    additionalUsers: Array.from(additionalUsers.values()),
    addUser,
    removeUser,
    reset,
  };
};

export default useAdditionalUsers;
