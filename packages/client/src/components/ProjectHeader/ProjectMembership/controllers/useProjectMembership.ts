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
    refetch: () => Promise<void>
}
export const useProjectMembership = (projectName: string): UseProjectMembership => {
    const projectHash: string = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(projectName.toUpperCase())
    );
    const projectRegistryResult = useCall({
        contract: Contracts.ProjectRegistry,
        method: "registry",
        args: [projectHash]
    });

    const projectAddress = projectRegistryResult.data === ethers.constants.AddressZero ? null : projectRegistryResult.data;

    // const [sendTransaction, state] = useTransaction(
    //     {
    //         contract: Contracts.ProjectRegistry,
    //         method: "registerProject",
    //         args:[projectHash, 2]
    //     }
    // );


    // const createProject = async () => {
    //     await sendTransaction();
    //     await projectRegistryResult.refetch();
    // }

    // console.log("STATE: ", state)
    
    return {
        unable: projectRegistryResult.unable,
        loading: projectRegistryResult.loading,
        error: projectRegistryResult.error,
        projectAddress,
        isMember: null,
        refetch: projectRegistryResult.refetch
    };
}