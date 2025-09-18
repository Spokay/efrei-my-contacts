import type {AuthDto, TokenResponse, UserResponse} from "./dto/auth-dto";
import {removeToken, storeToken} from "./token-service";
import BaseService from "./base-service";

export class AuthService extends BaseService{

    AUTH_BASE_URL = '/api/auth'

    async authenticate(authDto: AuthDto): Promise<void> {
        const data = new FormData()
        data.append('username', authDto.username)
        data.append('password', authDto.password)

        return this.postData<TokenResponse>(`${this.AUTH_BASE_URL}/login`, data)
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

    async getUser(): Promise<UserResponse> {
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