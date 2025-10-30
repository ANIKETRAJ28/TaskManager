import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorHandler, apiHandler } from "../util/apiHandler.util";
import { ApiError } from "../util/api.util";
import { IUser } from "../interface/user.interface";
import { options } from "../util/cookie.util";

class AuthMiddleware {
  verifyJWT(req: Request, res: Response): IUser {
    if (!req.cookies || !req.cookies["JWT"]) {
      throw new ApiError(401, "Unauthorized");
    }
    const jwtCookie = req.cookies["JWT"];
    const decodedToken = jwt.decode(jwtCookie);
    if (
      !decodedToken ||
      typeof decodedToken === "string" ||
      !decodedToken.exp
    ) {
      throw new ApiError(401, "Unauthorized");
    }
    if (decodedToken.exp * 1000 < Date.now()) {
      res.clearCookie("JWT", options);
      throw new ApiError(401, "Unauthorized");
    }
    const tokenData = decodedToken as IUser;
    return tokenData;
  }

  verifyUser(req: Request, res: Response): void {
    try {
      const user = this.verifyJWT(req, res);
      apiHandler(res, 200, "Token is valid", { user });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  validateUser(req: Request, res: Response, next: NextFunction): void {
    try {
      const tokenData = this.verifyJWT(req, res);
      req.user_id = tokenData.id;
      req.username = tokenData.username;
      next();
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default AuthMiddleware;
