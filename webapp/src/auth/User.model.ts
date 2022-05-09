export interface UserRequestAuth {
  username: string;
  password?: string;
}

export interface UserResponseAuth extends UserRequestAuth {
  salt: string;
  hash: string;
}

export interface UserAuthResponse {
  user: UserResponseAuth;
  token: string;
  expiresIn: number;
}
