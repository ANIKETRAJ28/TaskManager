import mockDb from "../__mocks__/prisma.mock";
import bcryptMocks from "../__mocks__/bcrypt.mock";
const { mockGenSalt, mockHash, mockCompare } = bcryptMocks;

import UserRepository from "../../src/repository/user.repository";
import { ApiError } from "../../src/util/api.util";
import { SALT_ROUNDS } from "../../src/config/dotenv.config";

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
  let repo: UserRepository;

  beforeEach(() => {
    repo = new UserRepository();
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      mockDb.user.findFirst.mockResolvedValueOnce(null);
      mockGenSalt.mockResolvedValueOnce("mockSalt");
      mockHash.mockResolvedValueOnce("mockHashValue");
      mockDb.user.create.mockResolvedValueOnce(mockDbUser);
      const result = await repo.register({ ...mockUserData });
      expect(mockDb.user.findFirst).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(mockGenSalt).toHaveBeenCalledWith(+SALT_ROUNDS);
      expect(mockHash).toHaveBeenCalledWith("plainPassword123", "mockSalt");
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          username: "testuser",
          password: "mockHashValue",
        },
      });
      expect(result).toEqual({ id: "1", username: "testuser" });
    });

    it("should throw ApiError(400) if user already exists", async () => {
      mockDb.user.findFirst.mockResolvedValueOnce(mockDbUser);
      await expect(repo.register(mockUserData)).rejects.toThrow(
        new ApiError(400, "User already exists")
      );
      expect(mockGenSalt).not.toHaveBeenCalled();
      expect(mockHash).not.toHaveBeenCalled();
      expect(mockDb.user.create).not.toHaveBeenCalled();
    });

    it("should throw a generic error if database creation fails", async () => {
      mockDb.user.findFirst.mockResolvedValueOnce(null);
      mockGenSalt.mockResolvedValueOnce("mockSalt");
      mockHash.mockResolvedValueOnce("mockHashValue");
      mockDb.user.create.mockRejectedValueOnce(
        new Error("Database connection lost")
      );
      await expect(repo.register({ ...mockUserData })).rejects.toThrow(
        "Database connection lost"
      );
    });
  });

  describe("login", () => {
    it("should log in a user with valid credentials", async () => {
      mockDb.user.findFirst.mockResolvedValueOnce(mockDbUser);
      mockCompare.mockResolvedValueOnce(true);
      const result = await repo.login(mockUserData);
      expect(mockDb.user.findFirst).toHaveBeenCalledWith({
        where: { username: "testuser" },
      });
      expect(mockCompare).toHaveBeenCalledWith(
        "plainPassword123",
        "mockHashValue"
      );
      expect(result).toEqual({ id: "1", username: "testuser" });
    });

    it("should throw ApiError(401) if user does not exist", async () => {
      mockDb.user.findFirst.mockResolvedValueOnce(null);
      await expect(repo.login(mockUserData)).rejects.toThrow(
        new ApiError(401, "Invalid credentials")
      );
      expect(mockCompare).not.toHaveBeenCalled();
    });

    it("should throw ApiError(401) if password is incorrect", async () => {
      mockDb.user.findFirst.mockResolvedValueOnce(mockDbUser);
      mockCompare.mockResolvedValueOnce(false);
      await expect(repo.login(mockUserData)).rejects.toThrow(
        new ApiError(401, "Invalid credentials")
      );
      expect(mockCompare).toHaveBeenCalledWith(
        "plainPassword123",
        "mockHashValue"
      );
    });

    it("should throw a generic error if bcrypt.compare fails", async () => {
      mockDb.user.findFirst.mockResolvedValueOnce(mockDbUser);
      mockCompare.mockRejectedValueOnce(new Error("Bcrypt algorithm error"));
      await expect(repo.login(mockUserData)).rejects.toThrow(
        "Bcrypt algorithm error"
      );
    });
  });
});
