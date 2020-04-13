import { GitlabUser, User } from "../dataSources/user";

const userId = 143423;
const name = "user";
const username = "username";
const avatarUrl = "https://www.google.com";
const email = "user@abc.com";

const gitlabUserTest: GitlabUser = {
  id: userId,
  name,
  username,
  avatar_url: avatarUrl,
  email,
};

const userTest: User = {
  id: userId,
  name,
  username,
  avatarUrl,
  email,
};

export { gitlabUserTest, userTest };
