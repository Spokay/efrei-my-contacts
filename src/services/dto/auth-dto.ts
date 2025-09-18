import type {BaseResponse} from "../base-service";

interface AuthDto {
  username: string
  password: string
}

interface TokenResponse extends BaseResponse{
  access_token: string
  token_type: string
}

interface UserResponse extends BaseResponse{
  username: string
}

export type {
  AuthDto,
  TokenResponse,
  UserResponse,
}