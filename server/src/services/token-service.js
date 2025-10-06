import {JWT_ALGORITHM, JWT_EXP, JWT_SECRET} from '../configuration/config.js';
import jwt from 'jsonwebtoken';

const secretKey = JWT_SECRET;

export const validateToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            secretKey,
            (err, decoded) => {
                if (err) {
                    return reject("Invalid token");
                }
                if (decoded) {
                    return resolve(decoded);
                }
                return reject("Invalid token");
            }
        );
    });
}
export const decodeToken = async (token) => {
    return jwt.decode(token);
}


export const generateToken = async (user) => {

    const expirationTime = Math.floor(Date.now() / 1000) + (typeof JWT_EXP === 'number' ? JWT_EXP : 3600);

    const payload = {
        sub: user._id,
        email: user.email,
    };

    return jwt.sign(
        payload,
        secretKey,
        {expiresIn: JWT_EXP, algorithm: JWT_ALGORITHM}
    );
}
