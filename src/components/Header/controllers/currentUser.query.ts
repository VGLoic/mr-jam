import { gql, DocumentNode } from "@apollo/client";

export const CURRENT_USER: DocumentNode = gql`
  {
    currentUser {
      id
      name
      avatarUrl
    }
  }
`;
