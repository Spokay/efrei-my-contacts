
import { JwtPayload } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload{
    sub: string;
    email: string;
}

export interface Token {
    token: string;
    payload: TokenPayload;
}