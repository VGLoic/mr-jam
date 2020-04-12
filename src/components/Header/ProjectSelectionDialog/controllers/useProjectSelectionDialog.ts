import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import { useHistory } from "react-router-dom";
// Query
import { PROJECTS } from "./projects.query";
// Types
import { ProjectsData, ProjectsInput } from "./projects.types";

export interface UseProjectSelectionDialog {
  triggerSearch: (search: string) => void;
  onLoadMore: () => void;
  called: boolean;
  initialLoading: boolean;
  loadingMore: boolean;
  researchLoading: boolean;
  data: ProjectsData | null;
  selectProject: (projectId: string) => void;
  selectedProjectId: string | null;
  onClose: () => void;
  confirm: () => void;
}

export const useProjectSelectionDialog = (
  toggleDialog: () => void
): UseProjectSelectionDialog => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [data, setData] = useState<ProjectsData | null>(null);
  const history = useHistory();

  const [
    searchProjects,
    { data: queryData, refetch, called, fetchMore, networkStatus },
  ] = useLazyQuery<ProjectsData, ProjectsInput>(PROJECTS, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (queryData) {
      setData(queryData);
    }
  }, [queryData]);

  const selectProject = (projectId: string): void => setProjectId(projectId);
  const onClose = (): void => {
    toggleDialog();
    setProjectId(null);
    setData(null);
  };

  const confirm = (): void => {
    if (projectId) {
      history.push(`/projects/${projectId}`);
      toggleDialog();
      setProjectId(null);
      setData(null);
    }
  };

  const triggerSearch = debounce((search: string): void => {
    if (!refetch) {
      searchProjects({ variables: { search } });
    } else {
      refetch({ search });
    }
  }, 500);

  const onLoadMore = (): void => {
    if (!fetchMore || !data) return;
    fetchMore({
      variables: {
        after: data.projects.pageInfo.endCursor,
      },
      updateQuery: (
        previousResult: ProjectsData,
        { fetchMoreResult }: { fetchMoreResult?: ProjectsData | undefined }
      ): ProjectsData => {
        if (!fetchMoreResult) return previousResult;

        const newEdges = fetchMoreResult.projects.edges;
        const pageInfo = fetchMoreResult.projects.pageInfo;
        return newEdges.length > 0
          ? {
              // Put the new projects at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              projects: {
                __typename: previousResult.projects.__typename,
                edges: [...previousResult.projects.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  return {
    triggerSearch,
    onLoadMore,
    called: called && Boolean(data),
    initialLoading: networkStatus === 1,
    researchLoading: networkStatus === 1 || networkStatus === 2,
    loadingMore: networkStatus === 3,
    data,
    selectProject,
    selectedProjectId: projectId,
    onClose,
    confirm,
  };
};
