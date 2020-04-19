import { gql, DocumentNode } from "@apollo/client";

export const PROJECTS: DocumentNode = gql`
  query projects($search: String!, $first: Int! = 3, $after: Int! = 0) {
    projects(search: $search, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          name
          description
          pathWithNamespace
        }
      }
    }
  }
`;
