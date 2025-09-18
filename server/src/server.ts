import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth-routes';
import { databaseConnection } from './configuration/database';
import { authMiddleware } from './middlewares/auth-middleware'
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use('/auth', authRoutes);

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