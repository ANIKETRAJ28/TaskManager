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
const mockRegisterUser = jest.fn();
const mockLogin = jest.fn();
const mockCreateTask = jest.fn();
const mockGetTaskByUser = jest.fn();
const mockUpdateTaskDetails = jest.fn();
const mockDeleteTask = jest.fn();
const mockJwtToken = jest.fn();
const mockJwtDecode = jest.fn();
jest.mock("../../src/service/user.service", () => {
    return jest.fn().mockImplementation(() => {
        return {
            registerUser: mockRegisterUser,
            login: mockLogin,
        };
    });
});
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
jest.mock("../../src/util/token.util", () => ({
    jwtToken: mockJwtToken,
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
describe("v1_router (Main Router)", () => {
    let app;
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        mockRegisterUser.mockResolvedValue({ id: "1", username: "test" });
        mockLogin.mockResolvedValue({ id: "1", username: "test" });
        mockJwtToken.mockReturnValue("mock.token.string");
        mockJwtDecode.mockReturnValue({
            id: "user-from-token",
            username: "test",
            exp: Math.floor(Date.now() / 1000) + 3600,
        });
        mockCreateTask.mockResolvedValue({ id: "1", title: "New Task" });
        mockGetTaskByUser.mockResolvedValue([{ id: "1", title: "My Task" }]);
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
    it("should route /auth/login to the user controller's service", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send({ user: "test" });
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockGetTaskByUser).not.toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Login successful");
    }));
    it("should route /tasks to the task controller's service", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/tasks")
            .set("Cookie", "JWT=valid.token");
        expect(mockGetTaskByUser).toHaveBeenCalledTimes(1);
        expect(mockLogin).not.toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Tasks fetched successfully");
    }));
    it("should return 404 for routes that do not match", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/unknown/route");
        expect(mockLogin).not.toHaveBeenCalled();
        expect(mockGetTaskByUser).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
    }));
});
