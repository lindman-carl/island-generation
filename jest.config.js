/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  transform: {},
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
