import request from "supertest";
import express, { Request, Response, NextFunction } from "express";

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
  let app: express.Express;

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

    a.use((req: Request, res: Response, next: NextFunction) => {
      res.locals = {};
      next();
    });

    app = a;
  });

  it("should correctly mount the v1_router at the /api prefix", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ user: "test" });
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });

  it("should return 404 for routes not at the /api prefix", async () => {
    const res = await request(app).get("/test-path");
    expect(mockLogin).not.toHaveBeenCalled();
    expect(res.status).toBe(404);
  });

  it("should parse JSON bodies using express.json()", async () => {
    const testBody = { key: "value" };
    await request(app).post("/api/auth/login").send(testBody);
    expect(mockLogin).toHaveBeenCalledWith(testBody);
  });

  it("should parse URL-encoded bodies using express.urlencoded()", async () => {
    const testBody = "key=value&another=test";
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", "JWT=valid.token")
      .type("form")
      .send(testBody);
    expect(mockCreateTask).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "value",
        another: "test",
      })
    );
    expect(res.status).toBe(201);
  });

  it("should parse cookies using cookieParser()", async () => {
    await request(app).post("/api/tasks").set("Cookie", "JWT=mycookie=hello");
    expect(mockJwtDecode).toHaveBeenCalledWith("mycookie=hello");
  });

  it("should apply CORS headers correctly", async () => {
    const res = await request(app)
      .get("/api/auth/verify")
      .set("Origin", "http://allowed-origin.com");
    expect(res.headers["access-control-allow-origin"]).toBe(
      "http://allowed-origin.com"
    );
  });
});
