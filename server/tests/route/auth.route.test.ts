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

import express from "express";
import request from "supertest";
import cookieParser from "cookie-parser";

describe("Auth Routes (v1)", () => {
  let app: express.Express;

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

    app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use((req, res, next) => {
      res.locals = {};
      next();
    });
    app.use(v1_router);
  });

  describe("POST /auth/register", () => {
    it("should call registerUser, set a cookie, and return 201", async () => {
      const res = await request(app)
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
    });
  });

  describe("POST /auth/login", () => {
    it("should call login, set a cookie, and return 200", async () => {
      const res = await request(app)
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
    });
  });

  describe("GET /auth/verify", () => {
    it("should call verifyJWT (via decode) and return 200", async () => {
      const res = await request(app)
        .get("/auth/verify")
        .set("Cookie", "JWT=valid.token");
      expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Token is valid");
    });
  });

  describe("POST /auth/logout", () => {
    it("should call validateUser (middleware) then logout (controller)", async () => {
      const res = await request(app)
        .post("/auth/logout")
        .set("Cookie", "JWT=valid.token");
      expect(mockJwtDecode).toHaveBeenCalledWith("valid.token");
      expect(res.headers["set-cookie"][0]).toContain("JWT=;");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logout successful");
    });
  });
});
