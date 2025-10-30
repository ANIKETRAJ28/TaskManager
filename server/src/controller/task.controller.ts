import { Request, Response } from "express";
import TaskService from "../service/task.service";
import { ITaskCreate, ITaskStatus } from "../interface/task.interface";
import { ApiError } from "../util/api.util";
import { apiHandler, errorHandler } from "../util/apiHandler.util";

class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user_id;
      if (userId === undefined) {
        throw new ApiError(401, "Unauthorized");
      }
      const data: Omit<ITaskCreate, "userId"> = req.body;
      const task = await this.taskService.createTask({ ...data, userId });
      apiHandler(res, 201, "Task created successfully", task);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async getTasksByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user_id;
      if (userId === undefined) {
        throw new ApiError(401, "Unauthorized");
      }
      const tasks = await this.taskService.getTaskByUser(userId);
      apiHandler(res, 200, "Tasks fetched successfully", tasks);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user_id;
      if (userId === undefined) {
        throw new ApiError(401, "Unauthorized");
      }
      let taskId = req.params.id;
      taskId = await this.taskService.deleteTask(userId, taskId);
      apiHandler(res, 200, "Task deleted successfully", { id: taskId });
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user_id;
      if (userId === undefined) {
        throw new ApiError(401, "Unauthorized");
      }
      const taskId = req.params.id;
      const status: ITaskStatus = req.body.status;
      const task = await this.taskService.updateTaskStatus(
        userId,
        taskId,
        status
      );
      apiHandler(res, 200, "Task status updated successfully", task);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}

export default TaskController;
