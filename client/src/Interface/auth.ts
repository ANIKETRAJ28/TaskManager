export interface IAuth {
  isAuthenticated: boolean;
  id: string | null;
  username: string | null;
  iat: string | null;
  exp: string | null;
}
