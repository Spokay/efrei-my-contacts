import {validateToken} from "../services/token-service.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    validateToken(token).then(tokenPayload => {
        req.tokenPayload = tokenPayload;
        next();
    }).catch(err => {
        return res.status(401).json({ message: 'Unauthorized', reason: err});
    });
};

