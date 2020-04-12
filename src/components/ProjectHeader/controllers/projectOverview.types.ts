import { User } from "types/user";

export interface ProjectOverview {
  id: string;
  name: string;
  pathWithNamespace: string;
  users: User[];
}

export interface ProjectOverviewData {
  project: ProjectOverview;
}

export interface ProjectOverviewInput {
  projectId: string;
}
