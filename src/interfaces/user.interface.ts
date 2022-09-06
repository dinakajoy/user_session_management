export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserWithoutPassword {
  name: string;
  email: string;
}