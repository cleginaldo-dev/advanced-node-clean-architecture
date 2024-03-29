module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts',
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/mocks/", "/migrations/", "/pagination/", "/utils/", "/errors/", "/entities/"],
  coverageProvider: "babel",
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/*.spec.ts'
  ],
  roots: [
    "<rootDir>/src",
    "<rootDir>/tests",
  ],
  transform: {
    '\\.ts$': 'ts-jest'
  },
  clearMocks: true,
};
