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
const task_controller_1 = __importDefault(require("../../src/controller/task.controller"));
const task_service_1 = __importDefault(require("../../src/service/task.service"));
jest.mock("../../src/service/task.service");
const mockTask = {
    id: "1",
    title: "Task Title",
    description: "Desc",
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
};
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.locals = {};
    return res;
};
describe("TaskController Unit Tests", () => {
    let controller;
    let req;
    let res;
    let mockService;
    beforeEach(() => {
        jest.clearAllMocks();
        task_service_1.default.mockClear();
        controller = new task_controller_1.default();
        mockService = task_service_1.default.mock
            .instances[0];
        req = { body: {}, params: {}, user_id: "user123" };
        res = mockResponse();
    });
    it("should create task successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        mockService.createTask.mockResolvedValue(mockTask);
        req.body = { title: "Task Title", description: "Desc" };
        yield controller.createTask(req, res);
        expect(mockService.createTask).toHaveBeenCalledWith({
            title: "Task Title",
            description: "Desc",
            userId: "user123",
        });
        expect(res.status).toHaveBeenCalledWith(201);
    }));
    it("should return 401 when no user id", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user_id = undefined;
        yield controller.createTask(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(mockService.createTask).not.toHaveBeenCalled();
    }));
    it("should return tasks for user", () => __awaiter(void 0, void 0, void 0, function* () {
        mockService.getTaskByUser.mockResolvedValue([mockTask]);
        yield controller.getTasksByUser(req, res);
        expect(mockService.getTaskByUser).toHaveBeenCalledWith("user123");
        expect(res.status).toHaveBeenCalledWith(200);
    }));
    it("should return 401 from getTasksByUser when no user id", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user_id = undefined;
        yield controller.getTasksByUser(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(mockService.getTaskByUser).not.toHaveBeenCalled();
    }));
    it("should delete task", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params.id = "1";
        mockService.deleteTask.mockResolvedValue("1");
        yield controller.deleteTask(req, res);
        expect(mockService.deleteTask).toHaveBeenCalledWith("user123", "1");
        expect(res.status).toHaveBeenCalledWith(200);
    }));
    it("should update task", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params.id = "1";
        req.body = mockTask;
        mockService.updateTaskDetails.mockResolvedValue(mockTask);
        yield controller.updateTaskStatus(req, res);
        expect(mockService.updateTaskDetails).toHaveBeenCalledWith("user123", mockTask);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
});
