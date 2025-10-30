import { Router } from "express";
import TaskController from "../../controller/task.controller";
import AuthMiddleware from "../../middleware/auth.middleware";

export const task_route = Router();

const taskController = new TaskController();
const authMiddleware = new AuthMiddleware();

task_route.post(
  "/",
  authMiddleware.validateUser.bind(authMiddleware),
  taskController.createTask.bind(taskController)
);
task_route.get(
  "/",
  authMiddleware.validateUser.bind(authMiddleware),
  taskController.getTasksByUser.bind(taskController)
);
task_route.put(
  "/:id",
  authMiddleware.validateUser.bind(authMiddleware),
  taskController.updateTaskStatus.bind(taskController)
);
task_route.delete(
  "/:id",
  authMiddleware.validateUser.bind(authMiddleware),
  taskController.deleteTask.bind(taskController)
);
