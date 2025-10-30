import { Router } from "express";
import { auth_route } from "./auth.route";
import { task_route } from "./task.route";

export const v1_router = Router();

v1_router.use("/auth", auth_route);
v1_router.use("/tasks", task_route);
