import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { databaseConnection } from './configuration/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
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