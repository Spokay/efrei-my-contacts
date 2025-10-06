import {Router} from 'express';
import {
    addContact,
    deleteContact,
    editContact,
    estContactExistant,
    findUserById,
    getContacts,
    validateNewContact
} from '../services/user-service.js';
import {User} from "../models/user.js";

const userRoutes = Router();

userRoutes.get('/me', async (req, res) => {
    const tokenPayload = await getTokenPayloadFromRequest(req, res);

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


userRoutes.get('/me/contacts', async (req, res) => {
    const tokenPayload = await getTokenPayloadFromRequest(req, res);

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


userRoutes.post('/me/contacts', async (req, res) => {
    const tokenPayload = await getTokenPayloadFromRequest(req, res);

    const newContact = req.body

    const user = await User.findById(tokenPayload.sub);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const newUserValidation = validateNewContact(newContact);

    if (!newUserValidation.isValid){
        return res.status(400).json({message: 'Bad request', details: newUserValidation.errors})
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

userRoutes.put('/me/contacts/:contactId', async (req, res) => {
    const tokenPayload = await getTokenPayloadFromRequest(req, res);
    const contactId = req.params.contactId;

    const updatedContact = req.body;

    const user = await User.findById(tokenPayload.sub);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (estContactExistant(updatedContact, user)) {
        return res.status(409).json({ message: 'Contact already exists' });
    }

    editContact(user, contactId, updatedContact)
        .then(newContact => {
            if (!newContact) {
                return res.status(404).json({ message: 'Contact not found' });
            }
            res.status(200).json(newContact);
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

userRoutes.delete('/me/contacts/:contactId', async (req, res) => {
    const tokenPayload = await getTokenPayloadFromRequest(req, res);
    const contactId = req.params.contactId;

    const user = await User.findById(tokenPayload.sub);


    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    deleteContact(user, contactId)
        .then(() => {
            res.status(204).send();
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

const getTokenPayloadFromRequest = async (req, res) => {
    const tokenPayload = req.tokenPayload;

    if (tokenPayload && tokenPayload.sub) {
        return tokenPayload;
    }
    res.status(401).json({ message: 'Invalid token' }).send();
    throw new Error('Invalid token');
}

export default userRoutes;
