import { ethers } from "ethers";
// Hooks
import { useCall } from "contexts/ethers/useCall";
// Config
import { Contracts } from "contexts/ethers/config";

export interface UseProjectMembership {
    unable: boolean;
    loading: boolean;
    error: string | null;
    projectAddress: string | null;
    isMember: boolean | null;
}
export const useProjectMembership = (projectName: string): UseProjectMembership => {
    const projectRegistryResult = useCall({
        contract: Contracts.ProjectRegistry,
        method: "registry",
        args: [
            ethers.utils.keccak256(
                ethers.utils.toUtf8Bytes(projectName.toUpperCase())
            )
        ]
    });

    const projectAddress = projectRegistryResult.data === ethers.constants.AddressZero ? null : projectRegistryResult.data;
    
    return {
        unable: projectRegistryResult.unable,
        loading: projectRegistryResult.loading,
        error: projectRegistryResult.error,
        projectAddress,
        isMember: null
    };
}