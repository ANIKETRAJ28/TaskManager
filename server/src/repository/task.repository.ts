import { PrismaClient } from "@prisma/client";
import prisma from "../config/db.config";
import { ITaskCreate, ITask, ITaskStatus } from "../interface/task.interface";
import { ApiError } from "../util/api.util";

class TaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async createTask(data: ITaskCreate): Promise<ITask> {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
      },
    });
    const createdTask = {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
    return createdTask;
  }

  async getTasksByUser(userId: string): Promise<ITask[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId: userId },
    });
    const userTasks: ITask[] = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }));
    return userTasks;
  }

  async deleteTask(userId: string, id: string): Promise<string> {
    const task = await this.prisma.task.findUnique({
      where: { id: id, userId: userId },
    });
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
    await this.prisma.task.delete({
      where: { id: id, userId: userId },
    });
    return task.id;
  }

  async updateTaskDetails(userId: string, task: ITask): Promise<ITask> {
    let existingTask = await this.prisma.task.findUnique({
      where: { id: task.id, userId: userId },
    });
    if (!existingTask) {
      throw new ApiError(404, "Task not found");
    }
    existingTask = await this.prisma.task.update({
      where: { id: task.id, userId: userId },
      data: {
        title: task.title,
        description: task.description,
      },
    });
    const updatedTask: ITask = {
      id: existingTask.id,
      title: existingTask.title,
      description: existingTask.description || undefined,
      status: existingTask.status,
      createdAt: existingTask.createdAt,
      updatedAt: existingTask.updatedAt,
    };
    return updatedTask;
  }
}

export default TaskRepository;
