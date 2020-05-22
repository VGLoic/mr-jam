import { useCall } from "contexts/ethers/useCall";
// Types
import { ethers } from "ethers";
import { MergeRequest } from "components/ProjectMergeRequests/controllers/mergeRequests.types";
// Constants
import { Contracts } from "contexts/ethers/config";
import useUser from "hooks/useUser";

interface GetBountyDetails {
  bountyAmount: ethers.utils.BigNumber;
  hasRedeemed: boolean;
  isContributor: boolean;
}

interface BountyDetails {
  amount: number;
  hasRedeemed: boolean;
  isContributor: boolean;
  isParticipant: boolean;
  mrState: string;
}

interface UseBountyHandlerArgs {
  mergeRequest: MergeRequest;
  projectAddress: string;
}

interface UseBountyHandler {
  error: string | null;
  bountyDetails: BountyDetails | null;
  refetchBounty: () => Promise<void>;
}
const useBountyHandler = ({
  mergeRequest,
  projectAddress,
}: UseBountyHandlerArgs): UseBountyHandler => {
  const { data: user } = useUser();
  const { data, error, refetch: refetchBounty } = useCall<GetBountyDetails>({
    contract: Contracts.Project,
    address: projectAddress,
    method: "getBountyDetails",
    args: [mergeRequest.id],
  });

  const participants = [
    ...mergeRequest.approvedBy,
    ...mergeRequest.reviews.reviewedBy,
  ].map((user) => user.id);

  const bountyDetails = !data
    ? null
    : {
        amount: data.bountyAmount.toNumber(),
        hasRedeemed: data.hasRedeemed,
        isContributor: data.isContributor,
        isParticipant: participants.includes(user?.id || ""),
        mrState: mergeRequest.state,
      };

  return {
    error,
    bountyDetails,
    refetchBounty,
  };
};

export default useBountyHandler;
