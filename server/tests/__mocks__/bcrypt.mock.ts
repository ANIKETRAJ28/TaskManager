export const mockGenSalt = jest.fn();
export const mockHash = jest.fn();
export const mockCompare = jest.fn();

jest.mock("bcrypt", () => ({
  genSalt: (...args: any[]) => mockGenSalt(...args),
  hash: (...args: any[]) => mockHash(...args),
  compare: (...args: any[]) => mockCompare(...args),
}));

export default { mockGenSalt, mockHash, mockCompare };
