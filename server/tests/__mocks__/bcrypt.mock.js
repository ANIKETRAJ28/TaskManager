"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockCompare = exports.mockHash = exports.mockGenSalt = void 0;
exports.mockGenSalt = jest.fn();
exports.mockHash = jest.fn();
exports.mockCompare = jest.fn();
jest.mock("bcrypt", () => ({
    genSalt: (...args) => (0, exports.mockGenSalt)(...args),
    hash: (...args) => (0, exports.mockHash)(...args),
    compare: (...args) => (0, exports.mockCompare)(...args),
}));
exports.default = { mockGenSalt: exports.mockGenSalt, mockHash: exports.mockHash, mockCompare: exports.mockCompare };
