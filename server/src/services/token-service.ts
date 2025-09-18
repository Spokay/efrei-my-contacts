import {TokenPayload} from '../models/auth/Token';
import {IUser} from '../models/User';
import {JWT_ALGORITHM, JWT_EXP, JWT_SECRET} from '../configuration/config';
import jwt, {JwtPayload} from 'jsonwebtoken';

const secretKey: string = JWT_SECRET;

export const isTokenValid = async (token: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            secretKey,
            (err, decoded) =>
                resolve(handleTokenValidationResult(err, decoded))
        );
    });
}

const handleTokenValidationResult = (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined): boolean => {
    if (err) {
        return false;
    }
    return !!decoded;

}

const decodeToken = async (token: string): Promise<TokenPayload | null> => {
    return jwt.decode(token) as TokenPayload;
}


export const generateToken = async (user: IUser): Promise<string> => {

    const expirationTime = Math.floor(Date.now() / 1000) + (typeof JWT_EXP === 'number' ? JWT_EXP : 3600);

    const payload: TokenPayload = {
        sub: user._id,
        email: user.email,
        exp: expirationTime,
        iat: Math.floor(Date.now() / 1000)
    };

    return jwt.sign(
        payload,
        secretKey,
        {expiresIn: JWT_EXP, algorithm: JWT_ALGORITHM}
    );
}