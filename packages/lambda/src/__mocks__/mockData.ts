import { GitlabUser, User } from "../dataSources/user";
import {
  GitlabProject,
  GitlabNamespace,
  Namespace,
  Project,
  GitlabMergeRequest,
  MergeRequest,
  GitlabApprovalRule,
  GitlabApprovalState,
  GitlabNote,
  Note,
} from "src/dataSources/project/models";

/** ################## **/
/** USERS **/
/** ################## **/

const userId = 143423;
const userName = "user";
const username = "username";
const avatarUrl = "https://www.google.com";
const email = "user@abc.com";

const gitlabUserTest: GitlabUser = {
  id: userId,
  name: userName,
  username,
  avatar_url: avatarUrl,
  email,
};

const userTest: User = {
  id: userId,
  name: userName,
  username,
  avatarUrl,
  email,
};

/** ################## **/
/** NAMESPACE **/
/** ################## **/
const namespaceId = 4535657;
const namespaceName = "namespace";
const namespaceFullPath = "/namespace";

const projectId = 324245;
const description = "description";
const projectName = "project";
const pathWithNamespace = "/namespace/project";
const createdAt = "2018-11-18";

const gitlabNamespaceTest: GitlabNamespace = {
  id: namespaceId,
  name: namespaceName,
  full_path: namespaceFullPath,
};

const namespaceTest: Namespace = {
  id: namespaceId,
  name: namespaceName,
  fullPath: namespaceFullPath,
};

/** ################## **/
/** PROJECT **/
/** ################## **/

const gitlabProjectTest: GitlabProject = {
  id: projectId,
  description,
  name: projectName,
  path_with_namespace: pathWithNamespace,
  namespace: gitlabNamespaceTest,
  created_at: createdAt,
};

const projectTest: Project = {
  id: projectId,
  description,
  name: projectName,
  pathWithNamespace,
  namespace: namespaceTest,
  createdAt,
};

/** ################## **/
/** MERGE REQUEST **/
/** ################## **/

const mrId = 32453465474567;
const mrIid = 325431349;
const mrTitle = "mr title";
const mrDescription = "mr description";
const mrState = "mr state";
const mrCreatedAt = "2018-12-18";
const mrUpdatedAt = "2019-12-18";
const mrMergedBy = null;
const mrMergedAt = null;
const mrTargetBranch = "master";
const mrSourceBranch = "test-branch";
const userNotesCount = 10;
const webUrl = "https://weburl.com";

const gitlabMrTest: GitlabMergeRequest = {
  id: mrId,
  iid: mrIid,
  project_id: projectTest.id,
  title: mrTitle,
  description: mrDescription,
  state: mrState,
  created_at: mrCreatedAt,
  updated_at: mrUpdatedAt,
  merged_by: mrMergedBy,
  merged_at: mrMergedAt,
  target_branch: mrTargetBranch,
  source_branch: mrSourceBranch,
  assignee: gitlabUserTest,
  author: gitlabUserTest,
  user_notes_count: userNotesCount,
  web_url: webUrl,
};

const mrTest: MergeRequest = {
  id: mrId,
  iid: mrIid,
  projectId: projectTest.id,
  title: mrTitle,
  description: mrDescription,
  state: mrState,
  createdAt: mrCreatedAt,
  updatedAt: mrUpdatedAt,
  mergedBy: mrMergedBy,
  mergedAt: mrMergedAt,
  targetBranch: mrTargetBranch,
  sourceBranch: mrSourceBranch,
  assignee: userTest,
  author: userTest,
  userNotesCount: userNotesCount,
  webUrl: webUrl,
};

/** ################## **/
/** APPROVERS **/
/** ################## **/

const approvalRuleId = 24535435;
const approvalRuleName = "approval rule";
const eligibleApprovers = [gitlabUserTest];
const approvalsRequired = 1;
const approvedBy = [gitlabUserTest];

const gitlabApprovalStateTest: GitlabApprovalState = {
  rules: [
    {
      id: approvalRuleId,
      name: approvalRuleName,
      eligible_approvers: eligibleApprovers,
      approvals_required: approvalsRequired,
      approved_by: approvedBy,
    },
  ],
};

/** ################## **/
/** Notes **/
/** ################## **/

const noteId = 534543534;
const type = "DiffNote";
const system = false;
const body = "body";
const noteCreatedAt = "2019-02-11";
const resolved = true;

const gitlabNoteTest: GitlabNote = {
  id: noteId,
  type,
  system,
  body,
  author: gitlabUserTest,
  created_at: noteCreatedAt,
  resolved,
};

const noteTest: Note = {
  id: noteId,
  type,
  body,
  author: userTest,
  createdAt: noteCreatedAt,
  resolved,
};

export {
  gitlabUserTest,
  userTest,
  gitlabProjectTest,
  projectTest,
  gitlabMrTest,
  mrTest,
  gitlabApprovalStateTest,
  gitlabNoteTest,
  noteTest,
};
