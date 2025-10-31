const mockRegisterUser = jest.fn();
const mockLogin = jest.fn();
const mockCreateTask = jest.fn();
const mockGetTaskByUser = jest.fn();
const mockUpdateTaskDetails = jest.fn();
const mockDeleteTask = jest.fn();
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
      createTask: mockCreateTask,
      getTaskByUser: mockGetTaskByUser,
      updateTaskDetails: mockUpdateTaskDetails,
      deleteTask: mockDeleteTask,
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

describe("v1_router (Main Router)", () => {
  let app: express.Express;
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    mockRegisterUser.mockResolvedValue({ id: "1", username: "test" });
    mockLogin.mockResolvedValue({ id: "1", username: "test" });
    mockJwtToken.mockReturnValue("mock.token.string");
    mockJwtDecode.mockReturnValue({
      id: "user-from-token",
      username: "test",
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    mockCreateTask.mockResolvedValue({ id: "1", title: "New Task" });
    mockGetTaskByUser.mockResolvedValue([{ id: "1", title: "My Task" }]);
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

  it("should route /auth/login to the user controller's service", async () => {
    const res = await request(app).post("/auth/login").send({ user: "test" });
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockGetTaskByUser).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });

  it("should route /tasks to the task controller's service", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Cookie", "JWT=valid.token");
    expect(mockGetTaskByUser).toHaveBeenCalledTimes(1);
    expect(mockLogin).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Tasks fetched successfully");
  });

  it("should return 404 for routes that do not match", async () => {
    const res = await request(app).get("/unknown/route");
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockGetTaskByUser).not.toHaveBeenCalled();
    expect(res.status).toBe(404);
  });
});
