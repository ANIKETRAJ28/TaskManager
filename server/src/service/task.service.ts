import { ITask, ITaskCreate, ITaskStatus } from "../interface/task.interface";
import TaskRepository from "../repository/task.repository";

class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async createTask(data: ITaskCreate): Promise<ITask> {
    const task = await this.taskRepository.createTask(data);
    return task;
  }

  async getTaskByUser(userId: string): Promise<ITask[]> {
    const tasks = await this.taskRepository.getTasksByUser(userId);
    return tasks;
  }

  async deleteTask(userId: string, id: string): Promise<string> {
    return await this.taskRepository.deleteTask(userId, id);
  }

  async updateTaskStatus(
    userId: string,
    id: string,
    status: ITaskStatus
  ): Promise<ITask> {
    const task = await this.taskRepository.updateTaskStatus(userId, id, status);
    return task;
  }
}

export default TaskService;
