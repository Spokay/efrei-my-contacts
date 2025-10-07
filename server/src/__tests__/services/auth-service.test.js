import { authenticate, isAuthRequestValid, isRegistrationRequestValid } from '../../services/auth-service.js';
import { findUserByEmail } from '../../services/user-service.js';
import { generateToken } from '../../services/token-service.js';
import { verifyPassword } from '../../utils/password-utils.js';

// Mock dependencies
jest.mock('../../services/user-service.js');
jest.mock('../../services/token-service.js');
jest.mock('../../utils/password-utils.js');

describe('Auth Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('authenticate()', () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      password: '$2b$10$hashedPasswordHere',
      firstName: 'Test',
      lastName: 'User'
    };

    const authRequest = {
      email: 'test@example.com',
      password: 'plainPassword123'
    };

    test('should successfully authenticate with valid credentials', async () => {
      // Arrange
      findUserByEmail.mockResolvedValue(mockUser);
      verifyPassword.mockReturnValue(true);
      generateToken.mockResolvedValue('mock-jwt-token');

      // Act
      const result = await authenticate(authRequest);

      // Assert
      expect(result).toBe('mock-jwt-token');
      expect(findUserByEmail).toHaveBeenCalledWith(authRequest.email);
      expect(verifyPassword).toHaveBeenCalledWith(authRequest.password, mockUser.password);
      expect(generateToken).toHaveBeenCalledWith(mockUser);
    });

    test('should throw error when user not found', async () => {
      // Arrange
      findUserByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authenticate(authRequest)).rejects.toThrow('Invalid email or password');
      expect(findUserByEmail).toHaveBeenCalledWith(authRequest.email);
      expect(verifyPassword).not.toHaveBeenCalled();
      expect(generateToken).not.toHaveBeenCalled();
    });

    test('should throw error when password is incorrect', async () => {
      // Arrange
      findUserByEmail.mockResolvedValue(mockUser);
      verifyPassword.mockReturnValue(false);

      // Act & Assert
      await expect(authenticate(authRequest)).rejects.toThrow('Invalid email or password');
      expect(findUserByEmail).toHaveBeenCalledWith(authRequest.email);
      expect(verifyPassword).toHaveBeenCalledWith(authRequest.password, mockUser.password);
      expect(generateToken).not.toHaveBeenCalled();
    });

    test('should use same error message for user not found and wrong password', async () => {
      // Test user not found
      findUserByEmail.mockResolvedValue(null);
      let errorMessage1;
      try {
        await authenticate(authRequest);
      } catch (error) {
        errorMessage1 = error.message;
      }

      // Test wrong password
      findUserByEmail.mockResolvedValue(mockUser);
      verifyPassword.mockReturnValue(false);
      let errorMessage2;
      try {
        await authenticate(authRequest);
      } catch (error) {
        errorMessage2 = error.message;
      }

      // Both should have identical error messages (security best practice)
      expect(errorMessage1).toBe(errorMessage2);
      expect(errorMessage1).toBe('Invalid email or password');
    });
  });

  describe('isAuthRequestValid()', () => {
    test('should return true for valid auth request', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const result = isAuthRequestValid(validRequest);

      expect(result).toBe(true);
    });

    test('should return false when email is empty', () => {
      const invalidRequest = {
        email: '',
        password: 'password123'
      };

      const result = isAuthRequestValid(invalidRequest);

      expect(result).toBe(false);
    });

    test('should return false when password is empty', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: ''
      };

      const result = isAuthRequestValid(invalidRequest);

      expect(result).toBe(false);
    });

    test('should return false when both email and password are empty', () => {
      const invalidRequest = {
        email: '',
        password: ''
      };

      const result = isAuthRequestValid(invalidRequest);

      expect(result).toBe(false);
    });
  });

  describe('isRegistrationRequestValid()', () => {
    test('should return true for valid registration request', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890'
      };

      const result = isRegistrationRequestValid(validRequest);

      expect(result).toBe(true);
    });

    test('should return false when email is empty', () => {
      const invalidRequest = {
        email: '',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890'
      };

      const result = isRegistrationRequestValid(invalidRequest);

      expect(result).toBe(false);
    });

    test('should return false when firstName is empty', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: 'password123',
        firstName: '',
        lastName: 'Doe',
        phone: '1234567890'
      };

      const result = isRegistrationRequestValid(invalidRequest);

      expect(result).toBe(false);
    });

    test('should return false when lastName is empty', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: '',
        phone: '1234567890'
      };

      const result = isRegistrationRequestValid(invalidRequest);

      expect(result).toBe(false);
    });

    test('should return false when phone is too short (< 10 characters)', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789' // 9 characters
      };

      const result = isRegistrationRequestValid(invalidRequest);

      expect(result).toBe(false);
    });

    test('should return false when phone is too long (> 20 characters)', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789012345678901' // 21 characters
      };

      const result = isRegistrationRequestValid(invalidRequest);

      expect(result).toBe(false);
    });

    test('should return true when phone is exactly 10 characters (boundary)', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890' // Exactly 10 characters
      };

      const result = isRegistrationRequestValid(validRequest);

      expect(result).toBe(true);
    });

    test('should return true when phone is exactly 20 characters (boundary)', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '12345678901234567890' // Exactly 20 characters
      };

      const result = isRegistrationRequestValid(validRequest);

      expect(result).toBe(true);
    });
  });
});
