import {AuthenticationRequest} from "../models/auth/Authentication";
import {IUser} from "../models/User";
import {findUserByEmail} from "./user-service";
import {generateToken} from "./token-service";
import {hashPassword} from "../utils/password-utils";

export const authenticate = async (authenticationRequest: AuthenticationRequest): Promise<string> => {

    const user: IUser | null = await findUserByEmail(authenticationRequest.email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (!validatePassword(authenticationRequest.password, user.password)) {
        throw new Error('Invalid email or password');
    }

    return generateToken(user);
}

export const isAuthRequestValid = (authRequest: AuthenticationRequest): boolean => {
    return authRequest.email.length > 0 && authRequest.password.length > 0;
}

const validatePassword = (inputPassword: string, storedPassword: string): boolean => {
    const hashedInputPassword = hashPassword(inputPassword);
    return hashedInputPassword === storedPassword;
}