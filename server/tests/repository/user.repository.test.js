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
const prisma_mock_1 = __importDefault(require("../__mocks__/prisma.mock"));
const bcrypt_mock_1 = __importDefault(require("../__mocks__/bcrypt.mock"));
const { mockGenSalt, mockHash, mockCompare } = bcrypt_mock_1.default;
const user_repository_1 = __importDefault(require("../../src/repository/user.repository"));
const api_util_1 = require("../../src/util/api.util");
const dotenv_config_1 = require("../../src/config/dotenv.config");
const mockUserData = {
    username: "testuser",
    password: "plainPassword123",
};
const mockDbUser = {
    id: "1",
    username: "testuser",
    password: "mockHashValue",
    createdAt: new Date(),
    updatedAt: new Date(),
};
describe("UserRepository", () => {
    let repo;
    beforeEach(() => {
        repo = new user_repository_1.default();
        jest.clearAllMocks();
    });
    describe("register", () => {
        it("should register a new user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.user.findFirst.mockResolvedValueOnce(null);
            mockGenSalt.mockResolvedValueOnce("mockSalt");
            mockHash.mockResolvedValueOnce("mockHashValue");
            prisma_mock_1.default.user.create.mockResolvedValueOnce(mockDbUser);
            const result = yield repo.register(Object.assign({}, mockUserData));
            expect(prisma_mock_1.default.user.findFirst).toHaveBeenCalledWith({
                where: { username: "testuser" },
            });
            expect(mockGenSalt).toHaveBeenCalledWith(+dotenv_config_1.SALT_ROUNDS);
            expect(mockHash).toHaveBeenCalledWith("plainPassword123", "mockSalt");
            expect(prisma_mock_1.default.user.create).toHaveBeenCalledWith({
                data: {
                    username: "testuser",
                    password: "mockHashValue",
                },
            });
            expect(result).toEqual({ id: "1", username: "testuser" });
        }));
        it("should throw ApiError(400) if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.user.findFirst.mockResolvedValueOnce(mockDbUser);
            yield expect(repo.register(mockUserData)).rejects.toThrow(new api_util_1.ApiError(400, "User already exists"));
            expect(mockGenSalt).not.toHaveBeenCalled();
            expect(mockHash).not.toHaveBeenCalled();
            expect(prisma_mock_1.default.user.create).not.toHaveBeenCalled();
        }));
        it("should throw a generic error if database creation fails", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.user.findFirst.mockResolvedValueOnce(null);
            mockGenSalt.mockResolvedValueOnce("mockSalt");
            mockHash.mockResolvedValueOnce("mockHashValue");
            prisma_mock_1.default.user.create.mockRejectedValueOnce(new Error("Database connection lost"));
            yield expect(repo.register(Object.assign({}, mockUserData))).rejects.toThrow("Database connection lost");
        }));
    });
    describe("login", () => {
        it("should log in a user with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.user.findFirst.mockResolvedValueOnce(mockDbUser);
            mockCompare.mockResolvedValueOnce(true);
            const result = yield repo.login(mockUserData);
            expect(prisma_mock_1.default.user.findFirst).toHaveBeenCalledWith({
                where: { username: "testuser" },
            });
            expect(mockCompare).toHaveBeenCalledWith("plainPassword123", "mockHashValue");
            expect(result).toEqual({ id: "1", username: "testuser" });
        }));
        it("should throw ApiError(401) if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.user.findFirst.mockResolvedValueOnce(null);
            yield expect(repo.login(mockUserData)).rejects.toThrow(new api_util_1.ApiError(401, "Invalid credentials"));
            expect(mockCompare).not.toHaveBeenCalled();
        }));
        it("should throw ApiError(401) if password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.user.findFirst.mockResolvedValueOnce(mockDbUser);
            mockCompare.mockResolvedValueOnce(false);
            yield expect(repo.login(mockUserData)).rejects.toThrow(new api_util_1.ApiError(401, "Invalid credentials"));
            expect(mockCompare).toHaveBeenCalledWith("plainPassword123", "mockHashValue");
        }));
        it("should throw a generic error if bcrypt.compare fails", () => __awaiter(void 0, void 0, void 0, function* () {
            prisma_mock_1.default.user.findFirst.mockResolvedValueOnce(mockDbUser);
            mockCompare.mockRejectedValueOnce(new Error("Bcrypt algorithm error"));
            yield expect(repo.login(mockUserData)).rejects.toThrow("Bcrypt algorithm error");
        }));
    });
});
