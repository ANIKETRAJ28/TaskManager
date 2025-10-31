import UserController from "../../src/controller/user.controller";
import UserService from "../../src/service/user.service";
import { IUser, IUserWithPassword } from "../../src/interface/user.interface";
import { ApiError } from "../../src/util/api.util";
import { jwtToken } from "../../src/util/token.util";
import { options } from "../../src/util/cookie.util";

jest.mock("../../src/service/user.service");
jest.mock("../../src/util/token.util", () => ({
  jwtToken: jest.fn(),
}));

const mockUser: IUser = {
  id: "1",
  username: "testuser",
};

const mockUserCredentials: IUserWithPassword = {
  username: "testuser",
  password: "plainPassword123",
};

const mockToken = "mock.jwt.token";

const mockJwtToken = jwtToken as jest.Mock;

const mockResponse = () => {
  const res: any = {};
  res.locals = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe("UserController", () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    (UserService as jest.Mock).mockClear();
    mockJwtToken.mockClear();
    controller = new UserController();
    mockUserService = (UserService as jest.Mock).mock
      .instances[0] as jest.Mocked<UserService>;
    req = { body: {} };
    res = mockResponse();
  });

  describe("register", () => {
    it("should register a user and set a cookie", async () => {
      req.body = mockUserCredentials;
      mockUserService.registerUser.mockResolvedValue(mockUser);
      mockJwtToken.mockReturnValue(mockToken);
      await controller.register(req, res);
      expect(mockUserService.registerUser).toHaveBeenCalledWith(
        mockUserCredentials
      );
      expect(mockJwtToken).toHaveBeenCalledWith(mockUser);
      expect(res.cookie).toHaveBeenCalledWith("JWT", mockToken, options);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User registered successfully",
        })
      );
    });

    it("should handle registration errors", async () => {
      req.body = mockUserCredentials;
      const error = new ApiError(400, "User already exists");
      mockUserService.registerUser.mockRejectedValue(error);
      await controller.register(req, res);
      expect(mockUserService.registerUser).toHaveBeenCalledWith(
        mockUserCredentials
      );
      expect(mockJwtToken).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "User already exists",
        })
      );
    });
  });

  describe("login", () => {
    it("should log in a user and set a cookie", async () => {
      req.body = mockUserCredentials;
      mockUserService.login.mockResolvedValue(mockUser);
      mockJwtToken.mockReturnValue(mockToken);
      await controller.login(req, res);
      expect(mockUserService.login).toHaveBeenCalledWith(mockUserCredentials);
      expect(mockJwtToken).toHaveBeenCalledWith(mockUser);
      expect(res.cookie).toHaveBeenCalledWith("JWT", mockToken, options);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Login successful",
        })
      );
    });

    it("should handle login errors", async () => {
      req.body = mockUserCredentials;
      const error = new ApiError(401, "Invalid credentials");
      mockUserService.login.mockRejectedValue(error);
      await controller.login(req, res);
      expect(mockUserService.login).toHaveBeenCalledWith(mockUserCredentials);
      expect(mockJwtToken).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Invalid credentials",
        })
      );
    });
  });

  describe("logout", () => {
    it("should clear the JWT cookie and return success", async () => {
      await controller.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith("JWT", options);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Logout successful",
        })
      );
    });

    it("should handle errors during logout", async () => {
      const error = new Error("Cookie monster ate the cookie");
      res.clearCookie.mockImplementation(() => {
        throw error;
      });
      await controller.logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith("JWT", options);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Internal Server Error",
        })
      );
    });
  });
});
