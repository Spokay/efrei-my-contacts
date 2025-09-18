import { Request, Response, Router } from 'express';
import {AuthenticationRequest, RegistrationRequest} from "../models/auth/Authentication";
import {isAuthRequestValid, isRegistrationRequestValid, authenticate} from "../services/auth-service";
import {createUser, userExistsByEmail} from "../services/user-service";

const authRoutes = Router();

authRoutes.post('/login', (req: Request, res: Response) => {
    const authRequest = req.body as AuthenticationRequest;

    if (!isAuthRequestValid(authRequest)) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    const token = authenticate(authRequest);

    if (!token) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    res.status(200).json({ token });
});

authRoutes.post('/register', (req: Request, res: Response) => {
    const registrationRequest: RegistrationRequest = req.body;

    if (!isRegistrationRequestValid(registrationRequest)) {
        return res.status(400).json({ message: 'Invalid registration request' });
    }

    if (userExistsByEmail(registrationRequest.email)) {
        return res.status(409).json({ message: 'User with this email already exists' });
    }

    createUser(registrationRequest)
        .then(token => {
            res.status(201).json({ token: token });
        }).catch(error => {
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
    });

})


export default authRoutes;