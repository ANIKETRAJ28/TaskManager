export const mockDb = {
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
  default: mockDb,
}));

export default mockDb;
