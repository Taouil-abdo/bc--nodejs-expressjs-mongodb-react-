// Simple Jest configuration for beginners
export default {
  // Use ES modules (import/export)
  preset: 'es-jest',
  
  // Test environment
  testEnvironment: 'node',
  
  // Where to find test files
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],
  
  // Transform ES modules
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Mock modules that don't work in test environment
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Show test coverage
  collectCoverage: true,
  coverageDirectory: 'coverage',
  
  // Which files to include in coverage
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**',
    '!src/server/**'
  ]
};