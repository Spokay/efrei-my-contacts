import { hashPassword, verifyPassword } from '../../utils/password-utils.js';

describe('Password Utils', () => {
  describe('hashPassword()', () => {
    test('should generate bcrypt hash with correct format', () => {
      const password = 'testPassword123';
      const hash = hashPassword(password);

      // Bcrypt hashes start with $2b$ and are 60 characters long
      expect(hash).toMatch(/^\$2b\$/);
      expect(hash).toHaveLength(60);
    });

    test('should generate hash that differs from plain password', () => {
      const password = 'mySecretPassword';
      const hash = hashPassword(password);

      // Hash should not contain the original password
      expect(hash).not.toBe(password);
      expect(hash).not.toContain(password);
    });

    test('should generate different hashes for same password (salting)', () => {
      const password = 'samePassword123';
      const hash1 = hashPassword(password);
      const hash2 = hashPassword(password);

      // Different salts should produce different hashes
      expect(hash1).not.toBe(hash2);
    });

    test('should handle empty string', () => {
      const password = '';
      const hash = hashPassword(password);

      // Should still produce a valid bcrypt hash
      expect(hash).toMatch(/^\$2b\$/);
      expect(hash).toHaveLength(60);
    });
  });

  describe('verifyPassword()', () => {
    test('should return true for correct password', () => {
      const password = 'correctPassword123';
      const hash = hashPassword(password);

      const result = verifyPassword(password, hash);

      expect(result).toBe(true);
    });

    test('should return false for incorrect password', () => {
      const password = 'correctPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = hashPassword(password);

      const result = verifyPassword(wrongPassword, hash);

      expect(result).toBe(false);
    });

    test('should return false for empty password against hash', () => {
      const password = 'actualPassword123';
      const hash = hashPassword(password);

      const result = verifyPassword('', hash);

      expect(result).toBe(false);
    });

    test('should handle case sensitivity correctly', () => {
      const password = 'CaseSensitive123';
      const hash = hashPassword(password);

      // Passwords should be case-sensitive
      expect(verifyPassword('casesensitive123', hash)).toBe(false);
      expect(verifyPassword('CaseSensitive123', hash)).toBe(true);
    });
  });
});
