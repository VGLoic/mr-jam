import { User } from "types/user";

export enum MrStates {
  Opened = "OPENED",
  Closed = "CLOSED",
  Merged = "MERGED",
  Locked = "LOCKED",
  All = "ALL",
}

export interface MergeRequest {
  id: string;
  iid: string;
  title: string;
  description: string;
  state: string;
  createdAt: string;
  author: User;
  userNotesCount: number;
  webUrl: string;
  approvedBy: User[];
  reviews: Reviews;
}

export interface Reviews {
  reviewedBy: User[];
}

export interface MergeRequestEdge {
  cursor: string;
  node: MergeRequest;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface MergeRequestConnection {
  __typename: string;
  edges: MergeRequestEdge[];
  pageInfo: PageInfo;
}

export interface MergeRequestsData {
  project: {
    __typename: string;
    id: string;
    mergeRequests: MergeRequestConnection;
  };
}

export interface MergeRequestsInput {
  projectId: string;
  mrState: MrStates;
  fromDate?: string;
  toDate?: string;
  first?: number;
  after?: string;
}
