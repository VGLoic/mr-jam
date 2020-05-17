import { ethers } from "ethers";
// Hooks
import { useCall } from "contexts/ethers/useCall";
import { useEthers } from "contexts/ethers";
// Config
import { Contracts } from "contexts/ethers/config";

export interface UseProjectMembership {
  unable: boolean;
  loading: boolean;
  error: string | null;
  projectAddress: string | null;
  isMember: boolean | null;
  isAdmin: boolean | null;
  refetchProjectAddress: () => Promise<void>;
}
const useProjectMembership = (projectName: string): UseProjectMembership => {
  const { selectedAddress } = useEthers();
  const projectHash: string = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(projectName.toUpperCase())
  );
  const {
    unable,
    data: retrievedProjectAddress,
    loading: projectAddressLoading,
    error: projectAddressError,
    refetch: refetchProjectAddress,
  } = useCall({
    contract: Contracts.ProjectRegistry,
    method: "registry",
    args: [projectHash],
  });

  const projectAddress =
    retrievedProjectAddress === ethers.constants.AddressZero
      ? null
      : retrievedProjectAddress;

  const {
    loading: adminAddressLoading,
    error: adminAddressError,
    data: adminAddress,
  } = useCall({
    contract: Contracts.Project,
    address: projectAddress,
    method: "owner",
    delayCondition: !projectAddress,
  });

  const {
    loading: isMemberLoading,
    error: isMemberError,
    data: isMember,
  } = useCall({
    contract: Contracts.Project,
    address: projectAddress,
    method: "isMember",
    args: [selectedAddress],
    delayCondition: !Boolean(projectAddress),
  });

  return {
    unable,
    loading:
      projectAddressLoading ||
      adminAddressLoading ||
      isMemberLoading ||
      (Boolean(projectAddress) &&
        (!Boolean(adminAddress) || !Boolean(isMember))),
    error: projectAddressError || adminAddressError || isMemberError,
    projectAddress,
    isMember,
    isAdmin:
      adminAddress &&
      ethers.utils.getAddress(adminAddress) ===
        ethers.utils.getAddress(selectedAddress as string),
    refetchProjectAddress,
  };
};

export default useProjectMembership;
