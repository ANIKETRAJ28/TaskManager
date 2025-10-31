import TaskService from "../../src/service/task.service";
import TaskRepository from "../../src/repository/task.repository";
import { ITask } from "../../src/interface/task.interface";

jest.mock("../../src/repository/task.repository");

const mockTask1: ITask = {
  id: "1",
  title: "Task 1",
  description: "Desc 1",
  status: "PENDING",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTasks = [mockTask1];

describe("TaskService", () => {
  let service: TaskService;
  let mockRepo: jest.Mocked<TaskRepository>;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new TaskService();
    mockRepo = (TaskRepository as jest.Mock).mock.instances[0] as any;
  });

  it("should create a task", async () => {
    mockRepo.createTask.mockResolvedValueOnce(mockTask1);
    const result = await service.createTask({
      title: "Task 1",
      description: "Desc 1",
      userId: "u1",
    });
    expect(mockRepo.createTask).toHaveBeenCalledWith({
      title: "Task 1",
      description: "Desc 1",
      userId: "u1",
    });
    expect(result).toEqual(mockTask1);
  });

  it("should get tasks by user", async () => {
    mockRepo.getTasksByUser.mockResolvedValueOnce(mockTasks);
    const result = await service.getTaskByUser("u1");
    expect(mockRepo.getTasksByUser).toHaveBeenCalledWith("u1");
    expect(result).toEqual(mockTasks);
  });

  it("should delete a task", async () => {
    mockRepo.deleteTask.mockResolvedValueOnce("1");
    const result = await service.deleteTask("u1", "1");
    expect(mockRepo.deleteTask).toHaveBeenCalledWith("u1", "1");
    expect(result).toBe("1");
  });

  it("should update task details", async () => {
    mockRepo.updateTaskDetails.mockResolvedValueOnce(mockTask1);
    const result = await service.updateTaskDetails("u1", mockTask1);
    expect(mockRepo.updateTaskDetails).toHaveBeenCalledWith("u1", mockTask1);
    expect(result).toEqual(mockTask1);
  });

  it("should throw error from repository", async () => {
    mockRepo.getTasksByUser.mockRejectedValueOnce(new Error("DB error"));
    await expect(service.getTaskByUser("u1")).rejects.toThrow("DB error");
  });
});
