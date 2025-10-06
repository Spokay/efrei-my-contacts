import { Router } from 'express';
import {isAuthRequestValid, isRegistrationRequestValid, authenticate} from "../services/auth-service.js";
import {createUser, userExistsByEmail} from "../services/user-service.js";

const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
    const authRequest = req.body;

    if (!isAuthRequestValid(authRequest)) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    authenticate(authRequest)
        .then(token => {
            res.status(200).json({ accessToken: token, tokenType: 'Bearer' });
        })
        .catch(error => {
            console.error('Authentication error:', error);
            res.status(401).json({ message: 'Authentication failed' });
        });
});

authRoutes.post('/register', async (req, res) => {
    const registrationRequest = req.body;

    if (!isRegistrationRequestValid(registrationRequest)) {
        return res.status(400).json({ message: 'Invalid registration request' });
    }

    if (await userExistsByEmail(registrationRequest.email)) {
        return res.status(409).json({ message: 'User with this email already exists' });
    }

    createUser(registrationRequest)
        .then(token => {
            res.status(201).json({ accessToken: token, tokenType: 'Bearer' });
        }).catch(error => {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
    });

})


export default authRoutes;
