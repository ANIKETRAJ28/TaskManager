jest.mock("../../src/config/dotenv.config", () => ({
  __esModule: true,
  SALT_ROUNDS: "10",
}));
