
export interface AuthenticationRequest {
    email: string;
    password: string;
}

export interface RegistrationRequest extends AuthenticationRequest {
    firstName: string;
    lastName: string;
    phone: string;
}