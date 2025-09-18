import { Request, Response, Router } from 'express';
import {AuthenticationRequest} from "../models/auth/Authentication";
import {isAuthRequestValid, authenticate} from "../services/auth-service";

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