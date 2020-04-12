import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
  concat,
  Operation,
  NextLink,
} from "@apollo/client";
import AuthUtils from "utils/auth.utils";

const httpLink: ApolloLink = new HttpLink({
  uri: "/.netlify/functions/main",
});

const authMiddleware: ApolloLink = new ApolloLink(
  (operation: Operation, forward: NextLink) => {
    // add the authorization to the headers
    operation.setContext({
      headers: {
        authorization: `Bearer ${AuthUtils.getToken()}`,
      },
    });

    return forward(operation);
  }
);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export { client };
