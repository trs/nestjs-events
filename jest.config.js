/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    "^.+\\.(t|j)s?$": ["@swc/jest", { sourceMaps: "inline" }],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/build/"],
  testMatch: ["<rootDir>/src/**/*.test.ts"],
  testEnvironment: "node",
  collectCoverage: false,
};
