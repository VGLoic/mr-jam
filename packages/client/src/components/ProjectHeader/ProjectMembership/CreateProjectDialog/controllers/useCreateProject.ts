import { ethers } from "ethers";
// Hooks and Types
import {
  useTransaction,
  TransactionState,
} from "contexts/ethers/useTransaction";
import useUser from "hooks/useUser";
import { useEthers } from "contexts/ethers";
import useUserInputs, { UseUserInputs } from "../../controllers/useUserInputs";
import useAdditionalUsers, {
  UseAdditionalUsers,
} from "../../controllers/useAdditionalUsers";
// Config
import { Contracts } from "contexts/ethers/config";

interface UseCreateProjectArgs {
  projectName: string;
  updateProjectAddress: () => Promise<void>;
  closeDialog: () => void;
}
interface UseCreateProject extends Omit<UseAdditionalUsers, "reset"> {
  unable: boolean;
  adminUserInputContext: UseUserInputs;
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

  const {
    additionalUserInputContext,
    additionalUsers,
    addUser,
    removeUser,
  } = useAdditionalUsers({ resetParameter: projectName });

  const [sendTransaction, transactionState] = useTransaction({
    contract: Contracts.ProjectRegistry,
    method: "registerProject",
    args: [
      ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(projectName.toUpperCase())
      ),
      adminUserInputContext.addressValue,
      adminUserInputContext.userValue?.id,
      additionalUsers.map((wrappedUser) => wrappedUser.address),
      additionalUsers.map((wrappedUser) => wrappedUser.user.id),
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
    additionalUsers,
    addUser,
    removeUser,
    transactionState,
    createProject,
    isConfirmDisabled,
  };
};

export default useCreateProject;
