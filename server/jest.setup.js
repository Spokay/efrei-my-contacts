// Setup file that runs before all tests
// Sets up environment variables needed for testing

process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXP = '1h';
process.env.JWT_ALGORITHM = 'HS256';
