import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import AuthMiddleware from "../../src/middleware/auth.middleware";

jest.mock("jsonwebtoken");
jest.mock("../../src/util/cookie.util", () => ({
  options: {
    httpOnly: true,
    secure: false,
  },
}));

const mockJwtDecode = jwt.decode as jest.Mock;
const getFutureExp = () => Math.floor(Date.now() / 1000) + 3600;
const getPastExp = () => Math.floor(Date.now() / 1000) - 3600;

const mockValidPayload = {
  id: "user123",
  username: "testuser",
  exp: getFutureExp(),
};

const mockExpiredPayload = {
  id: "user123",
  username: "testuser",
  exp: getPastExp(),
};

const app = express();
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals = {};
  next();
});

const authMiddleware = new AuthMiddleware();
app.get("/verify", authMiddleware.verifyUser.bind(authMiddleware));

app.get(
  "/validate",
  authMiddleware.validateUser.bind(authMiddleware),
  (req: Request, res: Response) => {
    res.status(200).json({
      message: "Validated",
      userId: req.user_id,
      username: req.username,
    });
  }
);

describe("AuthMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("verifyUser", () => {
    it("should return 200 with user data if the token is valid", async () => {
      mockJwtDecode.mockReturnValue(mockValidPayload);
      const res = await request(app)
        .get("/verify")
        .set("Cookie", "JWT=valid-token");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Token is valid");
      expect(res.body.data.user).toEqual({
        id: "user123",
        username: "testuser",
        exp: mockValidPayload.exp,
      });
    });

    it("should return 401 if no cookie is provided", async () => {
      const res = await request(app).get("/verify");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });

    it("should return 401 and clear cookie if token is expired", async () => {
      mockJwtDecode.mockReturnValue(mockExpiredPayload);
      const res = await request(app)
        .get("/verify")
        .set("Cookie", "JWT=expired-token");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
      expect(res.headers["set-cookie"][0]).toContain("JWT=;");
      expect(res.headers["set-cookie"][0]).toContain(
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
    });

    it("should return 401 if token is invalid (not an object)", async () => {
      mockJwtDecode.mockReturnValue("a-string-not-object");
      const res = await request(app)
        .get("/verify")
        .set("Cookie", "JWT=invalid-token");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });

    it('should return 401 if token has no "exp" field', async () => {
      mockJwtDecode.mockReturnValue({ id: "123", username: "no-exp" });
      const res = await request(app)
        .get("/verify")
        .set("Cookie", "JWT=no-exp-token");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });
  });

  describe("validateUser", () => {
    it("should call next() and attach user data to req if token is valid", async () => {
      mockJwtDecode.mockReturnValue(mockValidPayload);
      const res = await request(app)
        .get("/validate")
        .set("Cookie", "JWT=valid-token");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Validated");
      expect(res.body.userId).toBe("user123");
      expect(res.body.username).toBe("testuser");
    });

    it("should return 401 and not call next() if no cookie is provided", async () => {
      const res = await request(app).get("/validate");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
      expect(res.body.message).not.toBe("Validated");
    });

    it("should return 401 and not call next() if token is expired", async () => {
      mockJwtDecode.mockReturnValue(mockExpiredPayload);
      const res = await request(app)
        .get("/validate")
        .set("Cookie", "JWT=expired-token");
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
      expect(res.headers["set-cookie"][0]).toContain("JWT=;");
    });
  });
});
