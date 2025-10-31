"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockDb = void 0;
exports.mockDb = {
    user: {
        findFirst: jest.fn(),
        create: jest.fn(),
    },
    task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};
jest.mock("../../src/config/db.config", () => ({
    __esModule: true,
    default: exports.mockDb,
}));
exports.default = exports.mockDb;
