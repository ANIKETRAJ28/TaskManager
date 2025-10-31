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
const supertest_1 = __importDefault(require("supertest"));
const mockRegisterUser = jest.fn();
const mockLogin = jest.fn();
const mockJwtToken = jest.fn();
const mockJwtDecode = jest.fn();
const mockCreateTask = jest.fn();
jest.doMock("../src/service/user.service", () => {
    return jest.fn().mockImplementation(() => {
        return {
            registerUser: mockRegisterUser,
            login: mockLogin,
        };
    });
});
jest.doMock("../src/service/task.service", () => {
    return jest.fn().mockImplementation(() => {
        return {
            createTask: mockCreateTask,
            getTaskByUser: jest.fn().mockResolvedValue([]),
            updateTaskDetails: jest.fn().mockResolvedValue({}),
            deleteTask: jest.fn().mockResolvedValue("1"),
        };
    });
});
jest.doMock("../src/util/token.util", () => ({
    jwtToken: mockJwtToken,
}));
jest.doMock("jsonwebtoken", () => ({
    decode: mockJwtDecode,
}));
jest.doMock("../src/util/cors.util", () => ({
    corsOptions: {
        origin: "http://allowed-origin.com",
        credentials: true,
    },
}));
jest.doMock("../src/config/dotenv.config", () => ({
    PORT: 8080,
    FRONTEND_URL: "http://allowed-origin.com",
}));
describe("App (Main)", () => {
    let app;
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        mockLogin.mockResolvedValue({ id: "1", username: "test" });
        mockCreateTask.mockResolvedValue({ id: "t1", title: "task" });
        mockJwtDecode.mockReturnValue({
            id: "1",
            exp: Math.floor(Date.now() / 1000) + 3600,
        });
        mockJwtToken.mockReturnValue("mock.token");
        const { default: a } = require("../src/app");
        a.use((req, res, next) => {
            res.locals = {};
            next();
        });
        app = a;
    });
    it("should correctly mount the v1_router at the /api prefix", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/api/auth/login")
            .send({ user: "test" });
        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Login successful");
    }));
    it("should return 404 for routes not at the /api prefix", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get("/test-path");
        expect(mockLogin).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
    }));
    it("should parse JSON bodies using express.json()", () => __awaiter(void 0, void 0, void 0, function* () {
        const testBody = { key: "value" };
        yield (0, supertest_1.default)(app).post("/api/auth/login").send(testBody);
        expect(mockLogin).toHaveBeenCalledWith(testBody);
    }));
    it("should parse URL-encoded bodies using express.urlencoded()", () => __awaiter(void 0, void 0, void 0, function* () {
        const testBody = "key=value&another=test";
        const res = yield (0, supertest_1.default)(app)
            .post("/api/tasks")
            .set("Cookie", "JWT=valid.token")
            .type("form")
            .send(testBody);
        expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
            key: "value",
            another: "test",
        }));
        expect(res.status).toBe(201);
    }));
    it("should parse cookies using cookieParser()", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app).post("/api/tasks").set("Cookie", "JWT=mycookie=hello");
        expect(mockJwtDecode).toHaveBeenCalledWith("mycookie=hello");
    }));
    it("should apply CORS headers correctly", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .get("/api/auth/verify")
            .set("Origin", "http://allowed-origin.com");
        expect(res.headers["access-control-allow-origin"]).toBe("http://allowed-origin.com");
    }));
});
