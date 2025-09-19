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
                res.status(200).json(user);
            }
        })
        .catch(error => {
            return res.status(500).json({ message: 'Internal server error' });
        });
});


userRoutes.get('/me/contacts', async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload | null = await getTokenFromRequest(req, res);

    if(!tokenPayload || !tokenPayload.sub) {
        res.status(401).json({ message: 'Invalid token' });
        return null;
    }

    getContacts(tokenPayload.sub)
        .then(contacts => {
            if (!contacts) {
                res.status(404).json({ message: 'User not found' });
            } else{
                res.status(200).json(contacts);
            }
        })
        .catch(error => {
            return res.status(500).json({ message: 'Internal server error' });
        });
});


userRoutes.post('/me/contacts', async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload | null = await getTokenFromRequest(req, res);

    if(!tokenPayload || !tokenPayload.sub) {
        res.status(401).json({ message: 'Invalid token' });
    }

    const newContact = req.body as IContact

    const user = await User.findById(tokenPayload!.sub);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (estContactExistant(newContact, user)) {
        return res.status(409).json({ message: 'Contact already exists' });
    }

    addContact(user, newContact)
        .then(newContact => {
            res.status(201).json(newContact);
        }).catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

userRoutes.delete('/me/contacts/:contactId', async (req: Request, res: Response) => {

});

const getTokenFromRequest = async (req: Request, res: Response): Promise<TokenPayload | null> => {
    const authHeader: string | undefined = req.headers.authorization;

    const token = authHeader!.split(' ')[1];

    return await decodeToken(token);
}

export default userRoutes;