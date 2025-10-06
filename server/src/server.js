import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth-routes.js';
import userRoutes from './routes/user-routes.js';
import {corsConfig} from './configuration/cors.js';
import { databaseConnection } from './configuration/database.js';
import { authMiddleware } from './middlewares/auth-middleware.js'
import cors from 'cors';
import { swaggerUi, swaggerOptions, swaggerDocument } from './configuration/api-docs.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsConfig));
app.use(express.json());

app.use('/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions)
);

app.use('/auth', authRoutes);
app.use(authMiddleware);
app.use('/users', userRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

const startServer = async () => {
    await databaseConnection.connect().then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
};

startServer();
