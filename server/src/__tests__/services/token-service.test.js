import jwt from 'jsonwebtoken';
import { generateToken, validateToken, decodeToken } from '../../services/token-service.js';

// Mock the configuration
jest.mock('../../configuration/config.js', () => ({
  JWT_SECRET: 'test-secret-key',
  JWT_EXP: 3600,
  JWT_ALGORITHM: 'HS256'
}));

describe('Token Service', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  };

  describe('generateToken()', () => {
    test('should generate valid JWT structure', async () => {
      const token = await generateToken(mockUser);

      // JWT should have 3 parts separated by dots
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    test('should include correct user data in payload', async () => {
      const token = await generateToken(mockUser);
      const decoded = jwt.decode(token);

      expect(decoded.sub).toBe(mockUser._id);
      expect(decoded.email).toBe(mockUser.email);
    });

    test('should include expiration (exp claim)', async () => {
      const token = await generateToken(mockUser);
      const decoded = jwt.decode(token);

      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    test('should use correct algorithm (HS256)', async () => {
      const token = await generateToken(mockUser);
      const decoded = jwt.decode(token, { complete: true });

      expect(decoded.header.alg).toBe('HS256');
    });

    test('should generate different tokens for different users', async () => {
      const user1 = { _id: '507f1f77bcf86cd799439011', email: 'user1@example.com' };
      const user2 = { _id: '507f1f77bcf86cd799439012', email: 'user2@example.com' };

      const token1 = await generateToken(user1);
      const token2 = await generateToken(user2);

      expect(token1).not.toBe(token2);
    });

    test('should not include sensitive user data in token', async () => {
      const userWithPassword = {
        ...mockUser,
        password: 'hashedPassword123'
      };

      const token = await generateToken(userWithPassword);
      const decoded = jwt.decode(token);

      expect(decoded.password).toBeUndefined();
    });
  });

  describe('validateToken()', () => {
    test('should validate correctly signed token', async () => {
      const token = await generateToken(mockUser);

      await expect(validateToken(token)).resolves.toBeDefined();
    });

    test('should return decoded payload for valid token', async () => {
      const token = await generateToken(mockUser);
      const result = await validateToken(token);

      expect(result.sub).toBe(mockUser._id);
      expect(result.email).toBe(mockUser.email);
    });

    test('should reject token with invalid signature', async () => {
      const token = await generateToken(mockUser);
      // Tamper with the token by changing the last character
      const tamperedToken = token.slice(0, -1) + 'X';

      await expect(validateToken(tamperedToken)).rejects.toBe('Invalid token');
    });

    test('should reject malformed token', async () => {
      const malformedToken = 'not-a-valid-token';

      await expect(validateToken(malformedToken)).rejects.toBe('Invalid token');
    });

    test('should reject expired token', async () => {
      // Create token with -1 second expiration (already expired)
      const expiredToken = jwt.sign(
        { sub: mockUser._id, email: mockUser.email },
        'test-secret-key',
        { expiresIn: '-1s', algorithm: 'HS256' }
      );

      await expect(validateToken(expiredToken)).rejects.toBe('Invalid token');
    });

    test('should reject token signed with wrong secret', async () => {
      // Sign token with different secret
      const tokenWithWrongSecret = jwt.sign(
        { sub: mockUser._id, email: mockUser.email },
        'wrong-secret-key',
        { expiresIn: 3600, algorithm: 'HS256' }
      );

      await expect(validateToken(tokenWithWrongSecret)).rejects.toBe('Invalid token');
    });
  });

  describe('decodeToken()', () => {
    test('should decode valid token without validation', async () => {
      const token = await generateToken(mockUser);
      const decoded = await decodeToken(token);

      expect(decoded.sub).toBe(mockUser._id);
      expect(decoded.email).toBe(mockUser.email);
    });

    test('should decode token even with invalid signature', async () => {
      // Create token with wrong secret
      const token = jwt.sign(
        { sub: mockUser._id, email: mockUser.email },
        'wrong-secret',
        { expiresIn: 3600, algorithm: 'HS256' }
      );

      const decoded = await decodeToken(token);

      // Should still decode without validation
      expect(decoded.sub).toBe(mockUser._id);
      expect(decoded.email).toBe(mockUser.email);
    });

    test('should return null for malformed token', async () => {
      const malformedToken = 'not-a-token';
      const decoded = await decodeToken(malformedToken);

      expect(decoded).toBeNull();
    });
  });
});
