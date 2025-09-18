import {AuthenticationRequest, RegistrationRequest} from "../models/auth/Authentication";
import {IUser} from "../models/User";
import {findUserByEmail} from "./user-service";
import {generateToken} from "./token-service";
import {verifyPassword} from "../utils/password-utils";

export const authenticate = async (authenticationRequest: AuthenticationRequest): Promise<string> => {

    const user: IUser | null = await findUserByEmail(authenticationRequest.email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    if (!verifyPassword(authenticationRequest.password, user.password)) {
        throw new Error('Invalid email or password');
    }

    return generateToken(user);
}

export const isAuthRequestValid = (authRequest: AuthenticationRequest): boolean => {
    return authRequest.email.length > 0 && authRequest.password.length > 0;
}

export const isRegistrationRequestValid = (registrationRequest: RegistrationRequest): boolean => {
    return registrationRequest.email.length > 0 &&
        registrationRequest.password.length >= 0 &&
        registrationRequest.firstName.length > 0 &&
        registrationRequest.lastName.length > 0 &&
        validatePhoneNumber(registrationRequest.phone);
}


const validatePhoneNumber = (phoneNumber: string): boolean => {
    return phoneNumber.length >= 10 && phoneNumber.length <= 20;
}