module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/',
  ],
  globalSetup: './test/setup/setup.js',
  testEnvironment: 'node',
};
