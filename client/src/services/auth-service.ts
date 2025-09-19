import type {AuthDto, RegisterRequest, TokenResponse} from "./dto/auth-dto";
import {removeToken, storeToken} from "./token-service";
import BaseService from "./base-service";

export class AuthService extends BaseService{

    AUTH_BASE_URL = '/auth'

    async authenticate(authDto: AuthDto): Promise<void> {

        return this.postData<TokenResponse>(
            `${this.AUTH_BASE_URL}/login`,
            authDto
        )
        .then(r => {
            return r.data
        })
        .then(async r => {
            const token = r.accessToken
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
            registerRequest
        )
        .then(r => {
            return r.data
        })
        .then(async r => {
            if (!r.accessToken) {
                throw new Error('No access token in response')
            }

            const token = r.accessToken
            await storeToken(token)
            this.updateAuthToken(token)
        })
        .catch(error => {
            console.error('Registration failed:', error)
            throw error
        })
    }

    async logout(): Promise<void> {
        return removeToken()
            .then(() => {
                this.resetClient()
            })
    }

}

export const authService = new AuthService()