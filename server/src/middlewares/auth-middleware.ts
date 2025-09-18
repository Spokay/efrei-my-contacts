import { Request, Response, NextFunction, RequestHandler } from 'express';

import { isTokenValid } from '../services/token-service';

export const authMiddleware: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if (!isTokenValid(token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
};

