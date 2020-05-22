import { useState } from "react";
// Hooks
import {
  useTransaction,
  TransactionState,
} from "contexts/ethers/useTransaction";
// Constants
import { Contracts } from "contexts/ethers/config";

interface UsePlaceBountyArgs {
  mrId: string;
  refetchBounty: () => Promise<void>;
  refetchBalance: () => Promise<void>;
  onClose: () => void;
  projectAddress: string;
}

interface UsePlaceBounty {
  amount: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeBounty: () => Promise<void>;
  transactionState: TransactionState;
}
const usePlaceBounty = ({
  mrId,
  refetchBounty,
  refetchBalance,
  onClose,
  projectAddress,
}: UsePlaceBountyArgs): UsePlaceBounty => {
  const [amount, setAmount] = useState<string>("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setAmount(event.target.value);

  const [sendTransaction, transactionState] = useTransaction({
    contract: Contracts.Project,
    address: projectAddress,
    method: "contribute",
    args: [mrId, amount],
  });

  const placeBounty = async () => {
    await sendTransaction();
    await Promise.all([refetchBalance(), refetchBounty()]);
    onClose();
  };

  return {
    amount,
    onChange,
    placeBounty,
    transactionState,
  };
};

export default usePlaceBounty;
