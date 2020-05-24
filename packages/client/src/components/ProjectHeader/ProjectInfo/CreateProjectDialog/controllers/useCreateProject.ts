// Hooks and Types
import useTransaction, {
  TransactionState,
} from "contexts/ethers/useTransaction";
import useUser from "hooks/useUser";
import useEthers from "contexts/ethers/useEthers";
import useUserInputs, { UseUserInputs } from "../../controllers/useUserInputs";
import useAdditionalUsers, {
  UseAdditionalUsers,
} from "../../controllers/useAdditionalUsers";
// Config
import { Contracts } from "contexts/ethers/config";

interface UseCreateProjectArgs {
  projectId: string;
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
  projectId,
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
  } = useAdditionalUsers({ resetParameter: projectId });

  const [createProject, transactionState] = useTransaction({
    key: `project/register/${projectId}`,
    description: "Creating project on Ethereum",
    contract: Contracts.ProjectRegistry,
    method: "registerProject",
    args: [
      projectId,
      adminUserInputContext.addressValue,
      adminUserInputContext.userValue?.id,
      additionalUsers.map((wrappedUser) => wrappedUser.address),
      additionalUsers.map((wrappedUser) => wrappedUser.user.id),
    ],
    onBroadcast: closeDialog,
    onMined: updateProjectAddress,
  });

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
