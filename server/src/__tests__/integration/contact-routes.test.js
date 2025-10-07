import request from 'supertest';
import { connect, closeDatabase, clearDatabase, createTestUser } from '../helpers/test-db.js';
import { createTestApp } from '../helpers/test-app.js';

describe('Contact Management Integration Tests', () => {
  let app;

  beforeAll(async () => {
    await connect();
    app = createTestApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /users/me/contacts', () => {
    test('should successfully add a contact', async () => {
      // Arrange
      const { token } = await createTestUser();
      const newContact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890'
      };

      // Act
      const response = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(newContact);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.firstName).toBe('John');
      expect(response.body.lastName).toBe('Doe');
      expect(response.body.email).toBe('john.doe@example.com');
      expect(response.body.phone).toBe('1234567890');
      expect(response.body.isFavorite).toBe(false);
    });

    test('should add contact with minimal fields', async () => {
      // Arrange
      const { token } = await createTestUser();
      const newContact = {
        firstName: 'Jane',
        lastName: 'Smith'
      };

      // Act
      const response = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(newContact);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.firstName).toBe('Jane');
      expect(response.body.lastName).toBe('Smith');
      expect(response.body.email).toBeUndefined();
      expect(response.body.phone).toBeUndefined();
    });

    test('should reject contact with invalid phone (too short)', async () => {
      // Arrange
      const { token } = await createTestUser();
      const newContact = {
        firstName: 'Bob',
        lastName: 'Jones',
        phone: '123456789' // 9 characters
      };

      // Act
      const response = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(newContact);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bad request');
    });

    test('should reject contact with invalid phone (too long)', async () => {
      // Arrange
      const { token } = await createTestUser();
      const newContact = {
        firstName: 'Bob',
        lastName: 'Jones',
        phone: '123456789012345678901' // 21 characters
      };

      // Act
      const response = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(newContact);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bad request');
    });

    test('should accept contact with boundary phone lengths', async () => {
      // Arrange
      const { token } = await createTestUser();

      // Act - Test with 10 characters
      const response1 = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Test1',
          lastName: 'User1',
          phone: '1234567890' // Exactly 10 characters
        });

      // Assert
      expect(response1.status).toBe(201);
      expect(response1.body.phone).toBe('1234567890');

      // Act - Test with 20 characters
      const response2 = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'Test2',
          lastName: 'User2',
          phone: '12345678901234567890' // Exactly 20 characters
        });

      // Assert
      expect(response2.status).toBe(201);
      expect(response2.body.phone).toBe('12345678901234567890');
    });

    test('should allow adding contact with same data (BUG: duplicate detection broken)', async () => {
      // Note: The duplicate detection logic is broken
      // estContactExistant() uses .includes() which compares by reference, not value
      // This test documents the actual behavior

      // Arrange
      const { token } = await createTestUser();
      const contact = {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@test.com',
        phone: '1234567890'
      };

      // Act - Add contact first time
      const response1 = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(contact);

      expect(response1.status).toBe(201);

      // Act - Try to add same contact again
      const response2 = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(contact);

      // Assert - Currently allows duplicate (should be 409, but is 201)
      expect(response2.status).toBe(201);
    });

    test('should reject request with invalid JWT token', async () => {
      // Arrange
      const newContact = {
        firstName: 'Test',
        lastName: 'User'
      };

      // Act
      const response = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', 'Bearer invalid-token')
        .send(newContact);

      // Assert
      expect(response.status).toBe(401);
    });

    test('should reject request without authorization header', async () => {
      // Arrange
      const newContact = {
        firstName: 'Test',
        lastName: 'User'
      };

      // Act
      const response = await request(app)
        .post('/users/me/contacts')
        .send(newContact);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /users/me/contacts', () => {
    test('should get empty contacts list for new user', async () => {
      // Arrange
      const { token } = await createTestUser();

      // Act
      const response = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should get contacts after adding multiple contacts', async () => {
      // Arrange
      const { token } = await createTestUser();
      const contacts = [
        { firstName: 'Contact1', lastName: 'Test1', phone: '1234567890' },
        { firstName: 'Contact2', lastName: 'Test2', phone: '2345678901' },
        { firstName: 'Contact3', lastName: 'Test3', phone: '3456789012' }
      ];

      // Act - Add 3 contacts
      for (const contact of contacts) {
        await request(app)
          .post('/users/me/contacts')
          .set('Authorization', `Bearer ${token}`)
          .send(contact);
      }

      // Get all contacts
      const response = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].firstName).toBe('Contact1');
      expect(response.body[1].firstName).toBe('Contact2');
      expect(response.body[2].firstName).toBe('Contact3');
    });

    test('should verify contact data persistence after adding', async () => {
      // Arrange
      const { token } = await createTestUser();
      const newContact = {
        firstName: 'Test',
        lastName: 'Contact',
        email: 'test@example.com',
        phone: '5551234567'
      };

      // Act - Add contact
      const addResponse = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(newContact);

      // Get contacts
      const getResponse = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(getResponse.status).toBe(200);
      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0]._id).toBeDefined();
      expect(getResponse.body[0].firstName).toBe('Test');
      expect(getResponse.body[0].lastName).toBe('Contact');
      expect(getResponse.body[0].email).toBe('test@example.com');
      expect(getResponse.body[0].phone).toBe('5551234567');
      expect(getResponse.body[0].isFavorite).toBe(false);
    });

    test('should get only favorite contacts with filter', async () => {
      // Arrange
      const { token, userId } = await createTestUser();

      // Add 3 contacts
      await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Regular1', lastName: 'Contact1' });

      const favoriteResponse = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Favorite', lastName: 'Contact2' });

      await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Regular2', lastName: 'Contact3' });

      // Mark second contact as favorite
      const contactId = favoriteResponse.body._id;
      await request(app)
        .patch(`/users/me/contacts/${contactId}/favorite`)
        .set('Authorization', `Bearer ${token}`);

      // Act - Get favorite contacts only
      const response = await request(app)
        .get('/users/me/contacts?favorite=true')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].firstName).toBe('Favorite');
      expect(response.body[0].isFavorite).toBe(true);
    });

    test('should reject request with invalid token', async () => {
      // Act
      const response = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', 'Bearer invalid-token');

      // Assert
      expect(response.status).toBe(401);
    });

    test('should reject request without authorization header', async () => {
      // Act
      const response = await request(app)
        .get('/users/me/contacts');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('Cross-User Isolation', () => {
    test('should isolate contacts between different users', async () => {
      // Arrange - Create two users
      const { token: token1 } = await createTestUser({
        email: 'user1@example.com'
      });
      const { token: token2 } = await createTestUser({
        email: 'user2@example.com'
      });

      // Act - User 1 adds contact
      await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token1}`)
        .send({ firstName: 'User1Contact', lastName: 'Test' });

      // User 2 adds contact
      await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token2}`)
        .send({ firstName: 'User2Contact', lastName: 'Test' });

      // User 1 retrieves contacts
      const response1 = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token1}`);

      // User 2 retrieves contacts
      const response2 = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token2}`);

      // Assert
      expect(response1.status).toBe(200);
      expect(response1.body).toHaveLength(1);
      expect(response1.body[0].firstName).toBe('User1Contact');

      expect(response2.status).toBe(200);
      expect(response2.body).toHaveLength(1);
      expect(response2.body[0].firstName).toBe('User2Contact');
    });
  });

  describe('Integration Flow', () => {
    test('should complete full add and retrieve flow', async () => {
      // Step 1: Create new user and get JWT token
      const { token } = await createTestUser();

      // Step 2: GET /users/me/contacts - verify empty array
      const emptyResponse = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(emptyResponse.status).toBe(200);
      expect(emptyResponse.body).toEqual([]);

      // Step 3: POST contact 1 - verify 201 response
      const add1Response = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'First', lastName: 'Contact', phone: '1111111111' });
      expect(add1Response.status).toBe(201);
      expect(add1Response.body.firstName).toBe('First');

      // Step 4: GET /users/me/contacts - verify 1 contact returned
      const get1Response = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(get1Response.status).toBe(200);
      expect(get1Response.body).toHaveLength(1);

      // Step 5: POST contact 2 - verify 201 response
      const add2Response = await request(app)
        .post('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send({ firstName: 'Second', lastName: 'Contact', phone: '2222222222' });
      expect(add2Response.status).toBe(201);
      expect(add2Response.body.firstName).toBe('Second');

      // Step 6: GET /users/me/contacts - verify 2 contacts returned (correct order)
      const get2Response = await request(app)
        .get('/users/me/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(get2Response.status).toBe(200);
      expect(get2Response.body).toHaveLength(2);
      expect(get2Response.body[0].firstName).toBe('First');
      expect(get2Response.body[1].firstName).toBe('Second');

      // Step 7: Verify both contacts have all expected fields
      expect(get2Response.body[0]._id).toBeDefined();
      expect(get2Response.body[0].phone).toBe('1111111111');
      expect(get2Response.body[0].isFavorite).toBe(false);

      expect(get2Response.body[1]._id).toBeDefined();
      expect(get2Response.body[1].phone).toBe('2222222222');
      expect(get2Response.body[1].isFavorite).toBe(false);
    });
  });
});
