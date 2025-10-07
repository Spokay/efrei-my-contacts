import express from 'express';
import authRoutes from '../../routes/auth-routes.js';
import userRoutes from '../../routes/user-routes.js';
import { authMiddleware } from '../../middlewares/auth-middleware.js';
import cors from 'cors';

/**
 * Create Express app instance for testing
 * This setup mirrors the main server.js but without starting the server
 * @returns {Express} Express app instance
 */
export const createTestApp = () => {
  const app = express();

  // Apply middleware
  app.use(cors());
  app.use(express.json());

  // Apply routes
  app.use('/auth', authRoutes);
  app.use(authMiddleware);
  app.use('/users', userRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
};
