import UserService from "../../src/service/user.service";
import UserRepository from "../../src/repository/user.repository";
import { IUser, IUserWithPassword } from "../../src/interface/user.interface";

jest.mock("../../src/repository/user.repository");

const mockUser: IUser = {
  id: "1",
  username: "testuser",
};

const mockUserCredentials: IUserWithPassword = {
  username: "testuser",
  password: "plainPassword123",
};

describe("UserService", () => {
  let service: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService();
    mockRepo = (UserRepository as jest.Mock).mock.instances[0] as any;
  });

  it("should register user successfully", async () => {
    mockRepo.register.mockResolvedValueOnce(mockUser);
    const result = await service.registerUser(mockUserCredentials);
    expect(mockRepo.register).toHaveBeenCalledWith(mockUserCredentials);
    expect(result).toEqual(mockUser);
  });

  it("should throw error if register fails", async () => {
    mockRepo.register.mockRejectedValueOnce(new Error("User exists"));
    await expect(service.registerUser(mockUserCredentials)).rejects.toThrow(
      "User exists"
    );
  });

  it("should login user successfully", async () => {
    mockRepo.login.mockResolvedValueOnce(mockUser);
    const result = await service.login(mockUserCredentials);
    expect(mockRepo.login).toHaveBeenCalledWith(mockUserCredentials);
    expect(result).toEqual(mockUser);
  });

  it("should throw error if login fails", async () => {
    mockRepo.login.mockRejectedValueOnce(new Error("Invalid credentials"));
    await expect(service.login(mockUserCredentials)).rejects.toThrow(
      "Invalid credentials"
    );
  });
});
