import { Request, Response, Router } from 'express';
import { decodeToken } from '../services/token-service';
import { findUserById } from '../services/user-service';

const userRoutes = Router();

userRoutes.get('/me', async (req: Request, res: Response) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = await decodeToken(token);
    if (!decoded || !decoded.sub) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    findUserById(decoded.sub)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.status(200).json(JSON.stringify(user));
            }
        })
        .catch(error => {
            return res.status(500).json({ message: 'Internal server error' });
        });
});

export default userRoutes;