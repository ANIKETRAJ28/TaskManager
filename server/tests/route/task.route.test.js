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
const mockCreateTask = jest.fn();
const mockGetTaskByUser = jest.fn();
const mockUpdateTaskDetails = jest.fn();
const mockDeleteTask = jest.fn();
const mockJwtDecode = jest.fn();
jest.mock("../../src/service/task.service", () => {
    return jest.fn().mockImplementation(() => {
        return {
            createTask: mockCreateTask,
            getTaskByUser: mockGetTaskByUser,
            updateTaskDetails: mockUpdateTaskDetails,
            deleteTask: mockDeleteTask,
        };
    });
});
jest.mock("../../src/service/user.service", () => {
    return jest.fn().mockImplementation(() => {
        return {
            registerUser: jest.fn().mockResolvedValue({}),
            login: jest.fn().mockResolvedValue({}),
        };
    });
});
jest.mock("../../src/util/token.util", () => ({
    jwtToken: jest.fn().mockReturnValue("mock.token"),
}));
jest.mock("jsonwebtoken", () => ({
    decode: mockJwtDecode,
}));
jest.mock("../../src/util/cookie.util", () => ({
    options: { httpOnly: true, secure: false },
}));
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
describe("Task Routes (v1)", () => {
    let app;
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        mockCreateTask.mockResolvedValue({ id: "1", title: "New Task" });
        mockGetTaskByUser.mockResolvedValue([{ id: "1", title: "My Task" }]);
        mockUpdateTaskDetails.mockResolvedValue({ id: "1", title: "Updated Task" });
        mockDeleteTask.mockResolvedValue("1");
        mockJwtDecode.mockReturnValue({
            id: "user-from-token",
            username: "test",
            exp: Math.floor(Date.now() / 1000) + 3600,
        });
        const { v1_router } = require("../../src/route/v1_route");
        app = (0, express_1.default)();
        app.use((0, cookie_parser_1.default)());
        app.use(express_1.default.json());
        app.use((req, res, next) => {
            res.locals = {};
            next();
        });
        app.use(v1_router);
    });
    describe("POST /tasks", () => {
        it("should call validateUser then createTask", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post("/tasks")
                .set("Cookie", "JWT=valid.token")
                .send({ title: "New Task" });
            expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
            expect(mockCreateTask).toHaveBeenCalledWith({
                title: "New Task",
                userId: "user-from-token",
            });
            expect(res.status).toBe(201);
            expect(res.body.data.title).toBe("New Task");
        }));
    });
    describe("GET /tasks", () => {
        it("should call validateUser then getTasksByUser", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get("/tasks")
                .set("Cookie", "JWT=valid.token");
            expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
            expect(mockGetTaskByUser).toHaveBeenCalledWith("user-from-token");
            expect(res.status).toBe(200);
            expect(res.body.data[0].title).toBe("My Task");
        }));
    });
    describe("PUT /tasks/:id", () => {
        it("should call validateUser then updateTaskStatus", () => __awaiter(void 0, void 0, void 0, function* () {
            const taskUpdate = { title: "Updated Task" };
            const res = yield (0, supertest_1.default)(app)
                .put("/tasks/123")
                .set("Cookie", "JWT=valid.token")
                .send(taskUpdate);
            expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
            expect(mockUpdateTaskDetails).toHaveBeenCalledWith("user-from-token", taskUpdate);
            expect(res.status).toBe(200);
            expect(res.body.data.title).toBe("Updated Task");
        }));
    });
    describe("DELETE /tasks/:id", () => {
        it("should call validateUser then deleteTask", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .delete("/tasks/123")
                .set("Cookie", "JWT=valid.token");
            expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
            expect(mockDeleteTask).toHaveBeenCalledWith("user-from-token", "123");
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe("1");
        }));
    });
    describe("Protected Routes Failure", () => {
        it("should NOT call controller if middleware fails (no cookie)", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).post("/tasks").send({ title: "New Task" });
            expect(mockJwtDecode).not.toHaveBeenCalled();
            expect(mockCreateTask).not.toHaveBeenCalled();
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        }));
    });
});
