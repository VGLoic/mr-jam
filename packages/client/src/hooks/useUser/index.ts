import { ApolloError, useQuery } from "@apollo/client";
import { User } from "types/user";
import { CurrentUserData } from "./currentUser.types";
import { CURRENT_USER } from "./currentUser.query";

interface UseUser {
  data: User | undefined;
  loading: boolean;
  error: ApolloError | undefined;
}

const useUser = (): UseUser => {
  const { loading, error, data } = useQuery<CurrentUserData>(CURRENT_USER);

  return {
    loading,
    error,
    data: data?.currentUser,
  };
};

export default useUser;
