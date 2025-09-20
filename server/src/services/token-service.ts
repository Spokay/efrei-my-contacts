import {TokenPayload} from '../models/auth/token';
import {IUser} from '../models/user';
import {JWT_ALGORITHM, JWT_EXP, JWT_SECRET} from '../configuration/config';
import jwt, {JwtPayload} from 'jsonwebtoken';

const secretKey: string = JWT_SECRET;

export const validateToken = async (token: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            secretKey,
            (err, decoded) => {
                if (err) {
                    return reject("Invalid token");
                }
                if (decoded) {
                    return resolve(decoded as TokenPayload);
                }
                return reject("Invalid token");
            }
        );
    });
}
export const decodeToken = async (token: string): Promise<TokenPayload | null> => {
    return jwt.decode(token) as TokenPayload;
}


export const generateToken = async (user: IUser): Promise<string> => {

    const expirationTime = Math.floor(Date.now() / 1000) + (typeof JWT_EXP === 'number' ? JWT_EXP : 3600);

    const payload: TokenPayload = {
        sub: user._id,
        email: user.email,
    };

    return jwt.sign(
        payload,
        secretKey,
        {expiresIn: JWT_EXP, algorithm: JWT_ALGORITHM}
    );
}