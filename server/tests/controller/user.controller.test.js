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
const user_controller_1 = __importDefault(require("../../src/controller/user.controller"));
const user_service_1 = __importDefault(require("../../src/service/user.service"));
const api_util_1 = require("../../src/util/api.util");
const token_util_1 = require("../../src/util/token.util");
const cookie_util_1 = require("../../src/util/cookie.util");
jest.mock("../../src/service/user.service");
jest.mock("../../src/util/token.util", () => ({
    jwtToken: jest.fn(),
}));
const mockUser = {
    id: "1",
    username: "testuser",
};
const mockUserCredentials = {
    username: "testuser",
    password: "plainPassword123",
};
const mockToken = "mock.jwt.token";
const mockJwtToken = token_util_1.jwtToken;
const mockResponse = () => {
    const res = {};
    res.locals = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
};
describe("UserController", () => {
    let controller;
    let mockUserService;
    let req;
    let res;
    beforeEach(() => {
        jest.clearAllMocks();
        user_service_1.default.mockClear();
        mockJwtToken.mockClear();
        controller = new user_controller_1.default();
        mockUserService = user_service_1.default.mock
            .instances[0];
        req = { body: {} };
        res = mockResponse();
    });
    describe("register", () => {
        it("should register a user and set a cookie", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = mockUserCredentials;
            mockUserService.registerUser.mockResolvedValue(mockUser);
            mockJwtToken.mockReturnValue(mockToken);
            yield controller.register(req, res);
            expect(mockUserService.registerUser).toHaveBeenCalledWith(mockUserCredentials);
            expect(mockJwtToken).toHaveBeenCalledWith(mockUser);
            expect(res.cookie).toHaveBeenCalledWith("JWT", mockToken, cookie_util_1.options);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "User registered successfully",
            }));
        }));
        it("should handle registration errors", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = mockUserCredentials;
            const error = new api_util_1.ApiError(400, "User already exists");
            mockUserService.registerUser.mockRejectedValue(error);
            yield controller.register(req, res);
            expect(mockUserService.registerUser).toHaveBeenCalledWith(mockUserCredentials);
            expect(mockJwtToken).not.toHaveBeenCalled();
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "User already exists",
            }));
        }));
    });
    describe("login", () => {
        it("should log in a user and set a cookie", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = mockUserCredentials;
            mockUserService.login.mockResolvedValue(mockUser);
            mockJwtToken.mockReturnValue(mockToken);
            yield controller.login(req, res);
            expect(mockUserService.login).toHaveBeenCalledWith(mockUserCredentials);
            expect(mockJwtToken).toHaveBeenCalledWith(mockUser);
            expect(res.cookie).toHaveBeenCalledWith("JWT", mockToken, cookie_util_1.options);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Login successful",
            }));
        }));
        it("should handle login errors", () => __awaiter(void 0, void 0, void 0, function* () {
            req.body = mockUserCredentials;
            const error = new api_util_1.ApiError(401, "Invalid credentials");
            mockUserService.login.mockRejectedValue(error);
            yield controller.login(req, res);
            expect(mockUserService.login).toHaveBeenCalledWith(mockUserCredentials);
            expect(mockJwtToken).not.toHaveBeenCalled();
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Invalid credentials",
            }));
        }));
    });
    describe("logout", () => {
        it("should clear the JWT cookie and return success", () => __awaiter(void 0, void 0, void 0, function* () {
            yield controller.logout(req, res);
            expect(res.clearCookie).toHaveBeenCalledWith("JWT", cookie_util_1.options);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Logout successful",
            }));
        }));
        it("should handle errors during logout", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Cookie monster ate the cookie");
            res.clearCookie.mockImplementation(() => {
                throw error;
            });
            yield controller.logout(req, res);
            expect(res.clearCookie).toHaveBeenCalledWith("JWT", cookie_util_1.options);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Internal Server Error",
            }));
        }));
    });
});
