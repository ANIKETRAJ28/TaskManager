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
const task_service_1 = __importDefault(require("../../src/service/task.service"));
const task_repository_1 = __importDefault(require("../../src/repository/task.repository"));
jest.mock("../../src/repository/task.repository");
const mockTask1 = {
    id: "1",
    title: "Task 1",
    description: "Desc 1",
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockTasks = [mockTask1];
describe("TaskService", () => {
    let service;
    let mockRepo;
    beforeEach(() => {
        jest.clearAllMocks();
        service = new task_service_1.default();
        mockRepo = task_repository_1.default.mock.instances[0];
    });
    it("should create a task", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.createTask.mockResolvedValueOnce(mockTask1);
        const result = yield service.createTask({
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
    }));
    it("should get tasks by user", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.getTasksByUser.mockResolvedValueOnce(mockTasks);
        const result = yield service.getTaskByUser("u1");
        expect(mockRepo.getTasksByUser).toHaveBeenCalledWith("u1");
        expect(result).toEqual(mockTasks);
    }));
    it("should delete a task", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.deleteTask.mockResolvedValueOnce("1");
        const result = yield service.deleteTask("u1", "1");
        expect(mockRepo.deleteTask).toHaveBeenCalledWith("u1", "1");
        expect(result).toBe("1");
    }));
    it("should update task details", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.updateTaskDetails.mockResolvedValueOnce(mockTask1);
        const result = yield service.updateTaskDetails("u1", mockTask1);
        expect(mockRepo.updateTaskDetails).toHaveBeenCalledWith("u1", mockTask1);
        expect(result).toEqual(mockTask1);
    }));
    it("should throw error from repository", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.getTasksByUser.mockRejectedValueOnce(new Error("DB error"));
        yield expect(service.getTaskByUser("u1")).rejects.toThrow("DB error");
    }));
});
