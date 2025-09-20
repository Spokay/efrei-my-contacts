import {Request, Response, Router} from 'express';
import {
    addContact,
    deleteContact,
    editContact,
    estContactExistant,
    findUserById,
    getContacts
} from '../services/user-service';
import {TokenPayload} from "../models/auth/token";
import {IContact} from "../models/contact";
import {User} from "../models/user";

const userRoutes = Router();

userRoutes.get('/me', async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload = await getTokenPayloadFromRequest(req, res);

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
    const tokenPayload: TokenPayload = await getTokenPayloadFromRequest(req, res);

    getContacts(tokenPayload.sub)
        .then(contacts => {
            if (!contacts) {
                res.status(404).json({ message: 'User not found' });
            } else{
                res.status(200).json(contacts);
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        });
});


userRoutes.post('/me/contacts', async (req: Request, res: Response) => {
    const tokenPayload: TokenPayload = await getTokenPayloadFromRequest(req, res);

    const newContact = req.body as IContact

    const user = await User.findById(tokenPayload.sub);

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

userRoutes.put('/me/contacts/:contactId', async (req: Request, res: Response) => {

});

userRoutes.delete('/me/contacts/:contactId', async (req: Request, res: Response) => {

});

const getTokenPayloadFromRequest = async (req: Request, res: Response): Promise<TokenPayload> => {
    const tokenPayload: TokenPayload | undefined = req.tokenPayload;

    if (tokenPayload && tokenPayload.sub) {
        return tokenPayload;
    }
    res.status(401).json({ message: 'Invalid token' }).send();
    throw new Error('Invalid token');
}

export default userRoutes;