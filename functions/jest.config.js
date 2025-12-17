module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/src/**/*.test.ts"
  ],
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  }
};
