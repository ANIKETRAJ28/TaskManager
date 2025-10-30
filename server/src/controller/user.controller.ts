import { Request, Response } from "express";
import UserService from "../service/user.service";
import { apiHandler, errorHandler } from "../util/apiHandler.util";
import { jwtToken } from "../util/token.util";
import { IUser, IUserWithPassword } from "../interface/user.interface";
import { options } from "../util/cookie.util";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: IUserWithPassword = req.body;
      const user = await this.userService.registerUser(data);
      const token = jwtToken(user);
      res.cookie("JWT", token, options);
      apiHandler(res, 201, "User registered successfully");
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const data: IUserWithPassword = req.body;
      const user: IUser = await this.userService.login(data);
      const token = jwtToken(user);
      res.cookie("JWT", token, options);
      apiHandler(res, 200, "Login successful");
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("JWT", options);
      apiHandler(res, 200, "Logout successful");
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default UserController;
