import { UseProjectMembership } from "../useProjectMembership";

export const useProjectMembership = (): UseProjectMembership => ({
    unable: false,
    loading: false,
    error: null,
    projectAddress: "0x35896FE3C19b2058A3719877c11882BC94DcaF90",
    isMember: null
})