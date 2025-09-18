import dotenv from 'dotenv';
dotenv.config();

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export {
    BACKEND_BASE_URL
};
