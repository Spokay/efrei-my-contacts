import { Request, Response, Router } from 'express';
import {AuthenticationRequest, RegistrationRequest} from "../models/auth/authentication";
import {isAuthRequestValid, isRegistrationRequestValid, authenticate} from "../services/auth-service";
import {createUser, userExistsByEmail} from "../services/user-service";

const authRoutes = Router();

authRoutes.post('/login', async (req: Request, res: Response) => {
    const authRequest = req.body as AuthenticationRequest;

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

authRoutes.post('/register', async (req: Request, res: Response) => {
    const registrationRequest: RegistrationRequest = req.body as RegistrationRequest;

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