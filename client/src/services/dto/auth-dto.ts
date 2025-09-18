import type {BaseResponse} from "../base-service";

interface AuthDto {
    email: string
    password: string
}

interface RegisterRequest extends AuthDto {
    firstName: string
    lastName: string
    phone: string
}

interface TokenResponse extends BaseResponse{
    access_token: string
    token_type: string
}

interface UserResponse extends BaseResponse{
    email: string
    firstName: string
    lastName: string
    phone: string
}

export type {
    AuthDto,
    RegisterRequest,
    TokenResponse,
    UserResponse,
}