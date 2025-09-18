import type {AuthDto, RegisterRequest, TokenResponse, UserResponse} from "./dto/auth-dto";
import {removeToken, storeToken} from "./token-service";
import BaseService from "./base-service";

export class AuthService extends BaseService{

    AUTH_BASE_URL = '/api/auth'

    async authenticate(authDto: AuthDto): Promise<void> {

        return this.postData<TokenResponse>(
            `${this.AUTH_BASE_URL}/login`,
            JSON.stringify(authDto)
        )
        .then(r => {
            return r.data
        })
        .then(async r => {
            const token = r.access_token
            await storeToken(token)
            this.updateAuthToken(token)
        })
        .catch(error => {
            throw error
        })
    }

    async register(registerRequest: RegisterRequest): Promise<void> {
        return this.postData<TokenResponse>(
            `${this.AUTH_BASE_URL}/register`,
            JSON.stringify(registerRequest)
        )
        .then(r => r.data)
        .then(async r => {
            const token = r.access_token
            await storeToken(token)
            this.updateAuthToken(token)
        })
    }

    async getUserInfo(): Promise<UserResponse> {
        return this.fetchData<UserResponse>(`${this.AUTH_BASE_URL}/me`)
            .then(r => r.data)
    }

    async logout(): Promise<void> {
        return removeToken()
            .then(() => {
                this.resetClient()
            })
    }

}

export const authService = new AuthService()