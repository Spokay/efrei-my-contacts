import {NextFunction, Request, RequestHandler, Response} from 'express';
import {TokenPayload} from '../models/auth/token';
import {validateToken} from "../services/token-service";

declare global {
    namespace Express {
        interface Request {
            tokenPayload?: TokenPayload;
        }
    }
}

export const authMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    validateToken(token).then(tokenPayload => {
        req.tokenPayload = tokenPayload;
        next();
    }).catch(err => {
        return res.status(401).json({ message: 'Unauthorized', reason: err});
    });
};

