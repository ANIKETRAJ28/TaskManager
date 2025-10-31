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
const user_service_1 = __importDefault(require("../../src/service/user.service"));
const user_repository_1 = __importDefault(require("../../src/repository/user.repository"));
jest.mock("../../src/repository/user.repository");
const mockUser = {
    id: "1",
    username: "testuser",
};
const mockUserCredentials = {
    username: "testuser",
    password: "plainPassword123",
};
describe("UserService", () => {
    let service;
    let mockRepo;
    beforeEach(() => {
        jest.clearAllMocks();
        service = new user_service_1.default();
        mockRepo = user_repository_1.default.mock.instances[0];
    });
    it("should register user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.register.mockResolvedValueOnce(mockUser);
        const result = yield service.registerUser(mockUserCredentials);
        expect(mockRepo.register).toHaveBeenCalledWith(mockUserCredentials);
        expect(result).toEqual(mockUser);
    }));
    it("should throw error if register fails", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.register.mockRejectedValueOnce(new Error("User exists"));
        yield expect(service.registerUser(mockUserCredentials)).rejects.toThrow("User exists");
    }));
    it("should login user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.login.mockResolvedValueOnce(mockUser);
        const result = yield service.login(mockUserCredentials);
        expect(mockRepo.login).toHaveBeenCalledWith(mockUserCredentials);
        expect(result).toEqual(mockUser);
    }));
    it("should throw error if login fails", () => __awaiter(void 0, void 0, void 0, function* () {
        mockRepo.login.mockRejectedValueOnce(new Error("Invalid credentials"));
        yield expect(service.login(mockUserCredentials)).rejects.toThrow("Invalid credentials");
    }));
});
