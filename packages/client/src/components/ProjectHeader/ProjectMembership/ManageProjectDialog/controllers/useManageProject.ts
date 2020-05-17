// Hooks and Types
import {
  useTransaction,
  TransactionState,
} from "contexts/ethers/useTransaction";
import { useEthers } from "contexts/ethers";
import useAdditionalUsers, {
  UseAdditionalUsers,
} from "../../controllers/useAdditionalUsers";
// Config
import { Contracts } from "contexts/ethers/config";

interface UseManageProjectArgs {
  projectAddress: string;
  closeDialog: () => void;
}
interface UseManageProject extends Omit<UseAdditionalUsers, "reset"> {
  unable: boolean;
  transactionState: TransactionState;
  inviteUsers: () => Promise<void>;
  isConfirmDisabled: boolean;
}
const useManageProject = ({
  projectAddress,
  closeDialog,
}: UseManageProjectArgs): UseManageProject => {
  const { isEnabled } = useEthers();

  const {
    additionalUserInputContext,
    additionalUsers,
    addUser,
    removeUser,
    reset: resetAdditionalUsers,
  } = useAdditionalUsers({ resetParameter: projectAddress });

  const [sendTransaction, transactionState] = useTransaction({
    contract: Contracts.Project,
    method: "addMembers",
    address: projectAddress,
    args: [
      additionalUsers.map((wrappedUser) => wrappedUser.address),
      additionalUsers.map((wrappedUser) => wrappedUser.user.id),
    ],
  });

  const inviteUsers = async () => {
    await sendTransaction();
    closeDialog();
    resetAdditionalUsers();
  };

  const isConfirmDisabled =
    transactionState.loading || additionalUsers.length === 0;

  return {
    unable: !isEnabled,
    additionalUserInputContext,
    additionalUsers,
    addUser,
    removeUser,
    transactionState,
    inviteUsers,
    isConfirmDisabled,
  };
};

export default useManageProject;
