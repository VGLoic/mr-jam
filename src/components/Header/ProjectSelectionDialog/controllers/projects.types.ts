export interface Project {
  id: string;
  name: string;
  description: string;
  pathWithNamespace: string;
}

export interface ProjectsData {
  projects: ProjectConnection;
}

export interface ProjectEdge {
  cursor: number;
  node: Project;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: number | null;
}

export interface ProjectConnection {
  __typename: string;
  edges: ProjectEdge[];
  pageInfo: PageInfo;
}

export interface ProjectsInput {
  search: string;
  first?: number;
  after?: number;
}
