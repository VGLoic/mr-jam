export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface WrappedUser {
  address: string;
  user: User | null;
}
