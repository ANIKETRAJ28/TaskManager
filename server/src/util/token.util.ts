import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/dotenv.config";
import { IUser } from "../interface/user.interface";

export function jwtToken(data: IUser): string {
  const token = jwt.sign(data, JWT_SECRET_KEY as string, {
    expiresIn: "1d",
  });
  return token;
}
