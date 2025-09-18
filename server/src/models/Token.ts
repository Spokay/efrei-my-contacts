
import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload{
    email: string;
    roles: string[];
}

export interface Token {
    token: string;
    payload: TokenPayload;
}