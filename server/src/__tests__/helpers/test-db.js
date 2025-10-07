import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { User } from '../../models/user.js';
import { generateToken } from '../../services/token-service.js';
import { hashPassword } from '../../utils/password-utils.js';

let mongod;

/**
 * Connect to the in-memory database
 */
export const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

/**
 * Drop database, close the connection and stop mongod
 */
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

/**
 * Remove all the data for all db collections
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Create a test user with a valid JWT token
 * @param {Object} userData - Optional user data to override defaults
 * @returns {Promise<{user: Object, token: string, userId: string}>}
 */
export const createTestUser = async (userData = {}) => {
  const defaultData = {
    email: `test${Date.now()}@example.com`,
    password: hashPassword('testPassword123'),
    firstName: 'Test',
    lastName: 'User',
    phone: '1234567890',
    contacts: []
  };

  const user = await User.create({ ...defaultData, ...userData });
  const token = await generateToken(user);

  return {
    user,
    token,
    userId: user._id.toString()
  };
};
