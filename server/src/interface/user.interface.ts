export interface IUser {
  id: string;
  username: string;
}

export interface IUserWithPassword extends Omit<IUser, "id"> {
  password: string;
}
