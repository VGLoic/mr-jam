import { UseEthereumProject } from "../useEthereumProject";

export const mockEthereumProject: UseEthereumProject = {
  unable: true,
  loading: false,
  error: null,
  projectAddress: "0x35896FE3C19b2058A3719877c11882BC94DcaF90",
  isMember: null,
  isAdmin: null,
  balance: null,
  refetchProjectAddress: () => Promise.resolve(),
  refetchBalance: () => Promise.resolve(),
};

const useEthereumProject = (): UseEthereumProject => mockEthereumProject;

export default useEthereumProject;
