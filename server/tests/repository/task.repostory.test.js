"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../__mocks__/prisma.mock");
require("../__mocks__/dotenv.mock");
const prisma_mock_1 = __importDefault(require("../__mocks__/prisma.mock"));
const api_util_1 = require("../../src/util/api.util");
const task_repository_1 = __importDefault(require("../../src/repository/task.repository"));
const mockTask1 = {
    id: "1",
    title: "Task One",
    description: "First task",
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockTask2 = {
    id: "2",
    title: "Task Two",
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
    description: undefined,
};
describe("TaskRepository", () => {
    let repo;
    beforeEach(() => {
        repo = new task_repository_1.default();
        jest.clearAllMocks();
    });
    describe("createTask", () => {
        it("should create task with title and description", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.create.mockResolvedValueOnce(mockTask1);
            const task = yield repo.createTask({
                title: "Task One",
                description: "First task",
                userId: "u1",
            });
            expect(prisma_mock_1.default.task.create).toHaveBeenCalledWith({
                data: {
                    title: "Task One",
                    description: "First task",
                    userId: "u1",
                },
            });
            expect(task.title).toBe("Task One");
            expect(task.description).toBe("First task");
        }));
        it("should create task without description", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.create.mockResolvedValueOnce(Object.assign(Object.assign({}, mockTask2), { description: null }));
            const task = yield repo.createTask({
                title: "Task Without Description",
                userId: "u1",
            });
            expect(task.description).toBeUndefined();
        }));
    });
    describe("getTasksForUser", () => {
        it("should return all tasks for user", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findMany.mockResolvedValueOnce([mockTask1]);
            const tasks = yield repo.getTasksByUser("u1");
            expect(prisma_mock_1.default.task.findMany).toHaveBeenCalledWith({
                where: { userId: "u1" },
            });
            expect(tasks).toHaveLength(1);
            expect(tasks[0].id).toBe("1");
        }));
        it("should return an empty array if the user has no tasks", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findMany.mockResolvedValueOnce([]);
            const tasks = yield repo.getTasksByUser("u1");
            expect(tasks).toEqual([]);
        }));
        it("should map null description from db to undefined", () => __awaiter(void 0, void 0, void 0, function* () {
            const dbTaskWithNullDesc = Object.assign(Object.assign({}, mockTask1), { description: null });
            prisma_mock_1.default.task.findMany.mockResolvedValueOnce([dbTaskWithNullDesc]);
            const tasks = yield repo.getTasksByUser("u1");
            expect(tasks[0].description).toBeUndefined();
        }));
    });
    describe("updateTaskDetails", () => {
        it("should update an existing task details", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findUnique.mockResolvedValueOnce(mockTask1);
            prisma_mock_1.default.task.update.mockResolvedValueOnce(Object.assign(Object.assign({}, mockTask1), { title: "Updated Title" }));
            const updatedTaskData = Object.assign(Object.assign({}, mockTask1), { title: "Updated Title" });
            const updated = yield repo.updateTaskDetails("u1", updatedTaskData);
            expect(prisma_mock_1.default.task.findUnique).toHaveBeenCalledWith({
                where: { id: "1", userId: "u1" },
            });
            expect(prisma_mock_1.default.task.update).toHaveBeenCalledWith({
                where: { id: "1", userId: "u1" },
                data: { title: "Updated Title", description: "First task" },
            });
            expect(updated.title).toBe("Updated Title");
        }));
        it("should throw an ApiError if the task to update is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findUnique.mockResolvedValueOnce(null);
            yield expect(repo.updateTaskDetails("u1", mockTask1)).rejects.toThrow(api_util_1.ApiError);
            yield expect(repo.updateTaskDetails("u1", mockTask1)).rejects.toThrow("Task not found");
        }));
        it("should throw an error when attempt to update another user's task", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findUnique.mockResolvedValueOnce(null);
            yield expect(repo.updateTaskDetails("u2", mockTask1)).rejects.toThrow(api_util_1.ApiError);
        }));
    });
    describe("deleteTask", () => {
        it("should delete task and returns id", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findUnique.mockResolvedValueOnce(mockTask1);
            prisma_mock_1.default.task.delete.mockResolvedValueOnce(mockTask1);
            const deletedId = yield repo.deleteTask("u1", "1");
            expect(prisma_mock_1.default.task.findUnique).toHaveBeenCalledWith({
                where: { id: "1", userId: "u1" },
            });
            expect(prisma_mock_1.default.task.delete).toHaveBeenCalledWith({
                where: { id: "1", userId: "u1" },
            });
            expect(deletedId).toBe("1");
        }));
        it("should throw an ApiError if task not found", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findUnique.mockResolvedValueOnce(null);
            yield expect(repo.deleteTask("u1", "non-existent-id")).rejects.toThrow(api_util_1.ApiError);
            yield expect(repo.deleteTask("u1", "non-existent-id")).rejects.toThrow("Task not found");
        }));
        it("should throw an error when attempt to delete another user's task", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.task.findUnique.mockResolvedValueOnce(null);
            yield expect(repo.deleteTask("u2", "1")).rejects.toThrow(api_util_1.ApiError);
            expect(prisma_mock_1.default.task.delete).not.toHaveBeenCalled();
        }));
    });
});
