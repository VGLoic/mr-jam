import { AuthenticationError } from "apollo-server-lambda";
import { IDataSources } from "../dataSources";

export interface BaseContext {
  accessToken: string;
}

export interface Context extends BaseContext {
  dataSources: IDataSources;
}

function extractAccessToken(authorizationHeader: string): string {
  if (typeof authorizationHeader !== "string") return "";
  const bearerString: string = authorizationHeader.substring(0, 7);
  if (bearerString !== "Bearer ") return "";
  const accessToken: string = authorizationHeader.substring(7);
  return accessToken;
}

export function contextFunction({ event }: any): BaseContext {
  console.log("rest: ", event);
  const accessToken: string = extractAccessToken(event.headers.authorization);

  if (!accessToken) {
    throw new AuthenticationError("Unauthorized. No access token detected.");
  }

  return {
    accessToken,
  };
}
