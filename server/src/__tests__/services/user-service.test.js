import { validateNewContact } from '../../services/user-service.js';

describe('User Service - Contact Validation', () => {
  describe('validateNewContact() - Email Validation', () => {
    test('should accept valid email', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example.com'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should reject email without @ symbol', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'userexample.com'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The email must be a valid email address');
    });

    test('should reject email without domain', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The email must be a valid email address');
    });

    test('should reject email without domain extension', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@example'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The email must be a valid email address');
    });

    test('should reject email with multiple @ symbols', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user@@example.com'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The email must be a valid email address');
    });

    test('should reject email with spaces', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'user @example.com'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('The email must be a valid email address');
    });

    test('should allow empty email field', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: ''
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should allow missing email field', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should accept various valid email formats', () => {
      const validEmails = [
        'john.doe@test.com',
        'jane_smith@example.co.uk',
        'user123@domain.org',
        'test.user+tag@example.com'
      ];

      validEmails.forEach(email => {
        const contact = {
          firstName: 'Test',
          lastName: 'User',
          email
        };

        const result = validateNewContact(contact);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe('validateNewContact() - Combined Validation', () => {
    test('should return both errors when phone and email are invalid', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalidemail',
        phone: '123' // Too short
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors).toContain('The phone number must be between 10 and 20 characters');
      expect(result.errors).toContain('The email must be a valid email address');
    });

    test('should pass when both phone and email are valid', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should pass when phone is valid and email is missing', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should pass when email is valid and phone is missing', () => {
      const contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      const result = validateNewContact(contact);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
