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
            createTask: jest.fn().mockResolvedValue({}),
            getTaskByUser: jest.fn().mockResolvedValue([]),
            updateTaskDetails: jest.fn().mockResolvedValue({}),
            deleteTask: jest.fn().mockResolvedValue("1"),
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
describe("Auth Routes (v1)", () => {
    let app;
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        mockRegisterUser.mockResolvedValue({ id: "1", username: "test" });
        mockLogin.mockResolvedValue({ id: "1", username: "test" });
        mockJwtToken.mockReturnValue("mock.token.string");
        mockJwtDecode.mockReturnValue({
            id: "1",
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
    describe("POST /auth/register", () => {
        it("should call registerUser, set a cookie, and return 201", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post("/auth/register")
                .send({ username: "test", password: "123" });
            expect(mockRegisterUser).toHaveBeenCalledWith({
                username: "test",
                password: "123",
            });
            expect(mockJwtToken).toHaveBeenCalledWith({ id: "1", username: "test" });
            expect(res.headers["set-cookie"][0]).toContain("JWT=mock.token.string");
            expect(res.status).toBe(201);
            expect(res.body.message).toBe("User registered successfully");
        }));
    });
    describe("POST /auth/login", () => {
        it("should call login, set a cookie, and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post("/auth/login")
                .send({ username: "test", password: "123" });
            expect(mockLogin).toHaveBeenCalledWith({
                username: "test",
                password: "123",
            });
            expect(mockJwtToken).toHaveBeenCalledWith({ id: "1", username: "test" });
            expect(res.headers["set-cookie"][0]).toContain("JWT=mock.token.string");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Login successful");
        }));
    });
    describe("GET /auth/verify", () => {
        it("should call verifyJWT (via decode) and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .get("/auth/verify")
                .set("Cookie", "JWT=valid.token");
            expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Token is valid");
        }));
    });
    describe("POST /auth/logout", () => {
        it("should call validateUser (middleware) then logout (controller)", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app)
                .post("/auth/logout")
                .set("Cookie", "JWT=valid.token");
            expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
            expect(res.headers["set-cookie"][0]).toContain("JWT=;");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Logout successful");
        }));
    });
});
