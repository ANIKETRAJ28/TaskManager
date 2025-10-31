import "../__mocks__/prisma.mock";
import "../__mocks__/dotenv.mock";
import mockDb from "../__mocks__/prisma.mock";

import { ITask } from "../../src/interface/task.interface";
import { ApiError } from "../../src/util/api.util";
import TaskRepository from "../../src/repository/task.repository";

const mockTask1: ITask = {
  id: "1",
  title: "Task One",
  description: "First task",
  status: "PENDING",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTask2: ITask = {
  id: "2",
  title: "Task Two",
  status: "PENDING",
  createdAt: new Date(),
  updatedAt: new Date(),
  description: undefined,
};

describe("TaskRepository", () => {
  let repo: TaskRepository;

  beforeEach(() => {
    repo = new TaskRepository();
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create task with title and description", async () => {
      mockDb.task.create.mockResolvedValueOnce(mockTask1);
      const task = await repo.createTask({
        title: "Task One",
        description: "First task",
        userId: "u1",
      });
      expect(mockDb.task.create).toHaveBeenCalledWith({
        data: {
          title: "Task One",
          description: "First task",
          userId: "u1",
        },
      });
      expect(task.title).toBe("Task One");
      expect(task.description).toBe("First task");
    });

    it("should create task without description", async () => {
      mockDb.task.create.mockResolvedValueOnce({
        ...mockTask2,
        description: null,
      });
      const task = await repo.createTask({
        title: "Task Without Description",
        userId: "u1",
      });
      expect(task.description).toBeUndefined();
    });
  });

  describe("getTasksForUser", () => {
    it("should return all tasks for user", async () => {
      mockDb.task.findMany.mockResolvedValueOnce([mockTask1]);
      const tasks = await repo.getTasksByUser("u1");
      expect(mockDb.task.findMany).toHaveBeenCalledWith({
        where: { userId: "u1" },
      });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe("1");
    });

    it("should return an empty array if the user has no tasks", async () => {
      mockDb.task.findMany.mockResolvedValueOnce([]);
      const tasks = await repo.getTasksByUser("u1");
      expect(tasks).toEqual([]);
    });

    it("should map null description from db to undefined", async () => {
      const dbTaskWithNullDesc = { ...mockTask1, description: null };
      mockDb.task.findMany.mockResolvedValueOnce([dbTaskWithNullDesc]);
      const tasks = await repo.getTasksByUser("u1");
      expect(tasks[0].description).toBeUndefined();
    });
  });

  describe("updateTaskDetails", () => {
    it("should update an existing task details", async () => {
      mockDb.task.findUnique.mockResolvedValueOnce(mockTask1);
      mockDb.task.update.mockResolvedValueOnce({
        ...mockTask1,
        title: "Updated Title",
      });
      const updatedTaskData = { ...mockTask1, title: "Updated Title" };
      const updated = await repo.updateTaskDetails("u1", updatedTaskData);

      expect(mockDb.task.findUnique).toHaveBeenCalledWith({
        where: { id: "1", userId: "u1" },
      });
      expect(mockDb.task.update).toHaveBeenCalledWith({
        where: { id: "1", userId: "u1" },
        data: { title: "Updated Title", description: "First task" },
      });
      expect(updated.title).toBe("Updated Title");
    });

    it("should throw an ApiError if the task to update is not found", async () => {
      mockDb.task.findUnique.mockResolvedValueOnce(null);
      await expect(repo.updateTaskDetails("u1", mockTask1)).rejects.toThrow(
        ApiError
      );
      await expect(repo.updateTaskDetails("u1", mockTask1)).rejects.toThrow(
        "Task not found"
      );
    });

    it("should throw an error when attempt to update another user's task", async () => {
      mockDb.task.findUnique.mockResolvedValueOnce(null);
      await expect(repo.updateTaskDetails("u2", mockTask1)).rejects.toThrow(
        ApiError
      );
    });
  });

  describe("deleteTask", () => {
    it("should delete task and returns id", async () => {
      mockDb.task.findUnique.mockResolvedValueOnce(mockTask1);
      mockDb.task.delete.mockResolvedValueOnce(mockTask1);
      const deletedId = await repo.deleteTask("u1", "1");
      expect(mockDb.task.findUnique).toHaveBeenCalledWith({
        where: { id: "1", userId: "u1" },
      });
      expect(mockDb.task.delete).toHaveBeenCalledWith({
        where: { id: "1", userId: "u1" },
      });
      expect(deletedId).toBe("1");
    });

    it("should throw an ApiError if task not found", async () => {
      mockDb.task.findUnique.mockResolvedValueOnce(null);
      await expect(repo.deleteTask("u1", "non-existent-id")).rejects.toThrow(
        ApiError
      );
      await expect(repo.deleteTask("u1", "non-existent-id")).rejects.toThrow(
        "Task not found"
      );
    });

    it("should throw an error when attempt to delete another user's task", async () => {
      mockDb.task.findUnique.mockResolvedValueOnce(null);
      await expect(repo.deleteTask("u2", "1")).rejects.toThrow(ApiError);
      expect(mockDb.task.delete).not.toHaveBeenCalled();
    });
  });
});
