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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_middleware_1 = __importDefault(require("../../src/middleware/auth.middleware"));
jest.mock("jsonwebtoken");
jest.mock("../../src/util/cookie.util", () => ({
    options: {
        httpOnly: true,
        secure: false,
    },
}));
const mockJwtDecode = jsonwebtoken_1.default.decode;
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
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    res.locals = {};
    next();
});
const authMiddleware = new auth_middleware_1.default();
app.get("/verify", authMiddleware.verifyUser.bind(authMiddleware));
app.get("/validate", authMiddleware.validateUser.bind(authMiddleware), (req, res) => {
    res.status(200).json({
        message: "Validated",
        userId: req.user_id,
        username: req.username,
    });
});
describe("AuthMiddleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("verifyUser", () => {
        it("should return 200 with user data if the token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtDecode.mockReturnValue(mockValidPayload);
            const res = yield (0, supertest_1.default)(app)
                .get("/verify")
                .set("Cookie", "JWT=valid-token");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Token is valid");
            expect(res.body.data.user).toEqual({
                id: "user123",
                username: "testuser",
                exp: mockValidPayload.exp,
            });
        }));
        it("should return 401 if no cookie is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get("/verify");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        }));
        it("should return 401 and clear cookie if token is expired", () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtDecode.mockReturnValue(mockExpiredPayload);
            const res = yield (0, supertest_1.default)(app)
                .get("/verify")
                .set("Cookie", "JWT=expired-token");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
            expect(res.headers["set-cookie"][0]).toContain("JWT=;");
            expect(res.headers["set-cookie"][0]).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
        }));
        it("should return 401 if token is invalid (not an object)", () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtDecode.mockReturnValue("a-string-not-object");
            const res = yield (0, supertest_1.default)(app)
                .get("/verify")
                .set("Cookie", "JWT=invalid-token");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        }));
        it('should return 401 if token has no "exp" field', () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtDecode.mockReturnValue({ id: "123", username: "no-exp" });
            const res = yield (0, supertest_1.default)(app)
                .get("/verify")
                .set("Cookie", "JWT=no-exp-token");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
        }));
    });
    describe("validateUser", () => {
        it("should call next() and attach user data to req if token is valid", () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtDecode.mockReturnValue(mockValidPayload);
            const res = yield (0, supertest_1.default)(app)
                .get("/validate")
                .set("Cookie", "JWT=valid-token");
            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Validated");
            expect(res.body.userId).toBe("user123");
            expect(res.body.username).toBe("testuser");
        }));
        it("should return 401 and not call next() if no cookie is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app).get("/validate");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
            expect(res.body.message).not.toBe("Validated");
        }));
        it("should return 401 and not call next() if token is expired", () => __awaiter(void 0, void 0, void 0, function* () {
            mockJwtDecode.mockReturnValue(mockExpiredPayload);
            const res = yield (0, supertest_1.default)(app)
                .get("/validate")
                .set("Cookie", "JWT=expired-token");
            expect(res.status).toBe(401);
            expect(res.body.message).toBe("Unauthorized");
            expect(res.headers["set-cookie"][0]).toContain("JWT=;");
        }));
    });
});
