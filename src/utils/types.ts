import { User } from '@prisma/client';

export type GoogleUserDetails = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  provider: string;
  accessToken: string;
};

export type Done = (err: Error, user: User) => void;
