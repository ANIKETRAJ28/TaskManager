import TaskController from "../../src/controller/task.controller";
import TaskService from "../../src/service/task.service";
import { ITask } from "../../src/interface/task.interface";

jest.mock("../../src/service/task.service");

const mockTask: ITask = {
  id: "1",
  title: "Task Title",
  description: "Desc",
  status: "PENDING",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.locals = {};
  return res;
};

describe("TaskController Unit Tests", () => {
  let controller: TaskController;
  let req: any;
  let res: any;
  let mockService: jest.Mocked<TaskService>;
  beforeEach(() => {
    jest.clearAllMocks();
    (TaskService as jest.Mock).mockClear();
    controller = new TaskController();
    mockService = (TaskService as jest.Mock).mock
      .instances[0] as jest.Mocked<TaskService>;
    req = { body: {}, params: {}, user_id: "user123" };
    res = mockResponse();
  });

  it("should create task successfully", async () => {
    mockService.createTask.mockResolvedValue(mockTask);
    req.body = { title: "Task Title", description: "Desc" };
    await controller.createTask(req, res);
    expect(mockService.createTask).toHaveBeenCalledWith({
      title: "Task Title",
      description: "Desc",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return 401 when no user id", async () => {
    req.user_id = undefined;
    await controller.createTask(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockService.createTask).not.toHaveBeenCalled();
  });

  it("should return tasks for user", async () => {
    mockService.getTaskByUser.mockResolvedValue([mockTask]);
    await controller.getTasksByUser(req, res);
    expect(mockService.getTaskByUser).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 401 from getTasksByUser when no user id", async () => {
    req.user_id = undefined;
    await controller.getTasksByUser(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockService.getTaskByUser).not.toHaveBeenCalled();
  });

  it("should delete task", async () => {
    req.params.id = "1";
    mockService.deleteTask.mockResolvedValue("1");
    await controller.deleteTask(req, res);
    expect(mockService.deleteTask).toHaveBeenCalledWith("user123", "1");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should update task", async () => {
    req.params.id = "1";
    req.body = mockTask;
    mockService.updateTaskDetails.mockResolvedValue(mockTask);
    await controller.updateTaskStatus(req, res);
    expect(mockService.updateTaskDetails).toHaveBeenCalledWith(
      "user123",
      mockTask
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
