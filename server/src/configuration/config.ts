import ms, { StringValue } from 'ms';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}

export const JWT_SECRET: string = process.env.JWT_SECRET;

export const JWT_EXP: number | StringValue = process.env.JWT_EXP ? ms(process.env.JWT_EXP as StringValue) : ms('1h');

export const JWT_ALGORITHM: jwt.Algorithm = (process.env.JWT_ALGORITHM as jwt.Algorithm) || 'HS256';