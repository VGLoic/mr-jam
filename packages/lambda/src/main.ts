import { ApolloServer } from "apollo-server-lambda";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
import { dataSources } from "./dataSources";
import { contextFunction } from "./context/context";

const server: ApolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: contextFunction,
});

exports.handler = server.createHandler();
