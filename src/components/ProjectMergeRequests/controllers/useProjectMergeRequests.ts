import { ApolloError, useQuery } from "@apollo/client";
// Query
import { MERGE_REQUESTS } from "./mergeRequests.query";
import { MergeRequestsData, MergeRequestsInput } from "./mergeRequests.types";
// Hooks
import { useMrState, UseMrState } from "./useMrState";
import { useDateChoice } from "./useDateChoice";

export interface UseProjectMergeRequests extends UseMrState {
  initialLoading: boolean;
  loadingMore: boolean;
  data: MergeRequestsData | null;
  error: ApolloError | undefined;
  onLoadMore: () => void;
  fromDate: Date | null;
  onChangeFrom: (date: Date | null) => void;
  toDate: Date;
  onChangeTo: (date: Date) => void;
}
export const useProjectMergeRequests = (
  projectId: string
): UseProjectMergeRequests => {
  const { selectedMrState, selectMrState } = useMrState();

  const { fromDate, toDate, onChangeFrom, onChangeTo } = useDateChoice();

  const { data, error, fetchMore, networkStatus } = useQuery<
    MergeRequestsData,
    MergeRequestsInput
  >(MERGE_REQUESTS, {
    variables: {
      projectId,
      mrState: selectedMrState,
      fromDate: fromDate?.toISOString(),
      toDate: toDate.toISOString(),
    },
    notifyOnNetworkStatusChange: true,
  });

  const onLoadMore = (): void => {
    if (!fetchMore || !data) return;
    const endCursorDate = new Date(
      data.project.mergeRequests.pageInfo.endCursor
    );
    endCursorDate.setSeconds(endCursorDate.getSeconds() + 10);
    const after: string = endCursorDate.toISOString();
    fetchMore({
      variables: {
        after,
      },
      updateQuery: (
        previousResult: MergeRequestsData,
        { fetchMoreResult }: { fetchMoreResult?: MergeRequestsData | undefined }
      ): MergeRequestsData => {
        if (!fetchMoreResult) return previousResult;

        const newEdges = fetchMoreResult.project.mergeRequests.edges;
        const pageInfo = fetchMoreResult.project.mergeRequests.pageInfo;

        return newEdges.length > 0
          ? {
              // Put the new mergeRequests at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              project: {
                ...previousResult.project,
                mergeRequests: {
                  __typename: previousResult.project.mergeRequests.__typename,
                  edges: [
                    ...previousResult.project.mergeRequests.edges,
                    ...newEdges,
                  ],
                  pageInfo,
                },
              },
            }
          : previousResult;
      },
    });
  };

  return {
    selectedMrState,
    selectMrState,
    initialLoading: networkStatus === 1 || networkStatus === 2,
    loadingMore: networkStatus === 3,
    data: data || null,
    error,
    onLoadMore,
    fromDate,
    onChangeFrom,
    toDate,
    onChangeTo,
  };
};
