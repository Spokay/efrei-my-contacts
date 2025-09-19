import {Request, Response, Router} from 'express';
import {decodeToken} from '../services/token-service';
import {estContactExistant, findUserById, getContacts} from '../services/user-service';
import {TokenPayload} from "../models/auth/token";
import {IContact} from "../models/contact";
import {addContact} from "../services/user-service";
import {User} from "../models/user";

const userRoutes = Router();

userRoutes.get('/me', async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload | null = await getTokenFromRequest(req, res);

    if(!tokenPayload || !tokenPayload.sub) {
        res.status(401).json({ message: 'Invalid token' });
        return null;
    }


    findUserById(tokenPayload.sub)
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            } else {
                res.status(200).json(JSON.stringify(user));
                res.status(200).json(user);
            }
        })
        .catch(error => {
            return res.status(500).json({ message: 'Internal server error' });
        });
});

            }
        })
        .catch(error => {
            return res.status(500).json({ message: 'Internal server error' });
        });
});

export default userRoutes;