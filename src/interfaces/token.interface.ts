export interface ICreateToken {
  email: string;
  isRefreshToken: boolean;
}

export interface IVerifyToken {
  token: string;
  isRefreshToken: boolean;
}
