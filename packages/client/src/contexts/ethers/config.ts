import ProjectBuild from "smart-contracts/build/contracts/Project.json";
import ProjectRegistryBuild from "smart-contracts/build/contracts/ProjectRegistry.json";

export const allowedNetworks: Record<number, string> = {
    5777: "development"
};

export interface ContractMetadata {
    abi: any[];
    bytecode: string;
    networks?: Record<number, string>
}

export enum Contracts {
    ProjectRegistry = "ProjectRegistry",
    Project = "Project"
}

export interface ContractMetadatas {
    [Contracts.Project]: ContractMetadata;
    [Contracts.ProjectRegistry]: ContractMetadata
}

export const contractMetadatas: ContractMetadatas = {
    [Contracts.Project]: {
        abi: ProjectBuild.abi,
        bytecode: ProjectBuild.bytecode
    },
    [Contracts.ProjectRegistry]: {
        abi: ProjectRegistryBuild.abi,
        bytecode: ProjectRegistryBuild.bytecode,
        networks: Object.entries(ProjectRegistryBuild.networks).reduce(
            (acc: Record<number, string>, [networkId, networkInfo]: [string, any]) => ({
                ...acc,
                [parseInt(networkId)]: networkInfo.address
            }),
            {}
        )
    }
};
