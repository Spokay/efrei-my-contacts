import type {BaseResponse} from "../base-service";

interface AuthDto {
    email: string;
    password: string;
}

interface RegisterRequest extends AuthDto {
    firstName: string;
    lastName: string;
    phone: string;
}

interface TokenResponse extends BaseResponse{
    accessToken: string;
    tokenType: string;
}

interface UserResponse extends BaseResponse{
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}

export type {
    AuthDto,
    RegisterRequest,
    TokenResponse,
    UserResponse,
}