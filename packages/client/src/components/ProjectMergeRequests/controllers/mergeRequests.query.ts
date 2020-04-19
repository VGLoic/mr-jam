import { gql, DocumentNode } from "@apollo/client";

export const MERGE_REQUESTS: DocumentNode = gql`
  query project(
    $projectId: String!
    $mrState: MrStates!
    $first: Int! = 4
    $fromDate: String = "2020-01-01"
    $toDate: String
    $after: String
  ) {
    project(projectId: $projectId) {
      id
      mergeRequests(
        mrState: $mrState
        first: $first
        after: $after
        fromDate: $fromDate
        toDate: $toDate
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          cursor
          node {
            id
            iid
            title
            description
            state
            createdAt
            author {
              id
              name
              avatarUrl
            }
            userNotesCount
            webUrl
            approvedBy {
              id
              name
              avatarUrl
            }
            reviews {
              reviewedBy {
                id
                name
                avatarUrl
              }
            }
          }
        }
      }
    }
  }
`;
