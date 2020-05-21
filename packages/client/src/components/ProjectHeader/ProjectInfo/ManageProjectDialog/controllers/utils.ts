import { User, WrappedUser } from "types/user";
import { RawEthereumMember } from "./useManageProject";

interface MergeUsersAndEthereumMembers {
  wrappedEthereumMembers: WrappedUser[];
  nonMembers: User[];
}

export const mergeUsersAndEthereumMembers = (
  projectUsers: User[],
  rawEthereumMembers: RawEthereumMember[]
): MergeUsersAndEthereumMembers => {
  const userPool: Record<string, User> = projectUsers.reduce(
    (pool, user): Record<string, User> => {
      pool[user.id] = user;
      return pool;
    },
    {} as Record<string, User>
  );

  const wrappedEthereumMembers = rawEthereumMembers.map((member) => {
    const user = userPool[member.id] || null;
    delete userPool[member.id];
    return {
      address: member.address,
      user: user,
    };
  });

  const nonMembers = Object.values(userPool);

  return {
    wrappedEthereumMembers,
    nonMembers,
  };
};
