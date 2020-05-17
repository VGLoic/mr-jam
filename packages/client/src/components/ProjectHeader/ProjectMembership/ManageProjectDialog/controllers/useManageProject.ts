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
import { useCall } from "contexts/ethers/useCall";

interface RawSoldityMembers {
  0: string[];
  1: any[];
}

export interface RawEthereumMember {
  address: string;
  id: string;
}

interface UseManageProjectArgs {
  open: boolean;
  projectAddress: string;
  closeDialog: () => void;
}
interface UseManageProject extends Omit<UseAdditionalUsers, "reset"> {
  unable: boolean;
  loading: boolean;
  rawEthereumMembers: RawEthereumMember[] | null;
  transactionState: TransactionState;
  inviteUsers: () => Promise<void>;
  isConfirmDisabled: boolean;
}
const useManageProject = ({
  open,
  projectAddress,
  closeDialog,
}: UseManageProjectArgs): UseManageProject => {
  const { isEnabled } = useEthers();

  const { loading, data } = useCall<RawSoldityMembers>({
    contract: Contracts.Project,
    method: "getMembers",
    address: projectAddress,
    delayCondition: !open,
  });

  const rawEthereumMembers: RawEthereumMember[] | null = data
    ? data[0].map((address, index) => ({
        address,
        id: data[1][index].toString(),
      }))
    : null;

  const idBlackList: string[] = [];
  const addressBlackList: string[] = [];
  rawEthereumMembers?.forEach((member) => {
    idBlackList.push(member.id);
    addressBlackList.push(member.address);
  });

  const {
    additionalUserInputContext,
    additionalUsers,
    addUser,
    removeUser,
    reset: resetAdditionalUsers,
  } = useAdditionalUsers({
    resetParameter: projectAddress,
    addressBlackList,
    idBlackList,
  });

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
    loading,
    rawEthereumMembers,
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
