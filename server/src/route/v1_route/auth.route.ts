import { Router } from "express";
import UserController from "../../controller/user.controller";
import AuthMiddleware from "../../middleware/auth.middleware";

export const auth_route = Router();

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

auth_route.post("/register", userController.register.bind(userController));
auth_route.post("/login", userController.login.bind(userController));
auth_route.get("/verify", authMiddleware.verifyUser.bind(authMiddleware));
auth_route.post(
  "/logout",
  authMiddleware.validateUser.bind(authMiddleware),
  userController.logout.bind(userController)
);
