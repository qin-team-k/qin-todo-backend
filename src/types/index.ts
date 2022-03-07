export type GoogleUserDetails = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type JwtPayload = {
  sub: string;
  username: string;
  email: string;
  avatarUrl: string;
  iat?: 1646635782;
  exp?: 1646636682;
};
