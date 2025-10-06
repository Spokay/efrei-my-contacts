import ms from 'ms';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

export const JWT_SECRET = process.env.JWT_SECRET;

export const JWT_EXP = process.env.JWT_EXP ? ms(process.env.JWT_EXP) : ms('1h');

export const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';
