module.exports = {
  testEnvironment: "jsdom",
  testMatch: [
    "<rootDir>/test/or-selection/**/*.test.ts",
    "<rootDir>/test/or-selection/**/*.test.tsx",
  ],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          module: "commonjs",
        },
        diagnostics: false,
        isolatedModules: true,
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/test/or-selection/setup.ts"],
  clearMocks: true,
};
