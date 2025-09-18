import {getToken, verifyTokenExpiration} from './token-service'
import {BACKEND_BASE_URL} from "../configuration/config"
import axios, {Axios} from 'axios'
import type { AxiosInstance , AxiosResponse } from 'axios';

export type BaseResponse = object

class BaseService {
  baseUrl: string
  baseClient: Axios & { defaults: { headers: { Authorization?: string } } }

  constructor() {
    this.baseUrl = BACKEND_BASE_URL
    this.baseClient = this.createClient()
  }

  private createClient(): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
  }

  async resetClient(): Promise<void> {
    delete this.baseClient.defaults.headers.Authorization
  }

  async fetchData<BaseResponse>(url: string, params?: never): Promise<AxiosResponse<BaseResponse>> {
    return this.getClient()
        .then(client => {
          return client.get<BaseResponse>(`${this.baseUrl}${url}`, params)
        })
  }

  async postData<BaseResponse>(url: string, data: object | string | FormData, content_type?: string): Promise<AxiosResponse<BaseResponse>> {
    return this.getClient()
        .then(client => {
          if (data instanceof FormData) {
            return client.postForm<BaseResponse>(
                `${this.baseUrl}${url}`,
                data,
                content_type ? { headers: { 'Content-Type': content_type } } : {}
            )
          }
          return client.post<BaseResponse>(
              `${this.baseUrl}${url}`,
              data
          );
        })
  }

  async deleteData(url: string): Promise<AxiosResponse<void>> {
    return this.getClient()
        .then(client => {
      return client.delete<void>(`${this.baseUrl}${url}`);
    })
  }

  async putData<BaseResponse>(url: string, data: never, content_type?: string): Promise<AxiosResponse<BaseResponse>> {
    return this.getClient()
        .then(client => {
          return client.put<BaseResponse>(
              `${this.baseUrl}${url}`,
              data,
              content_type ? { headers: { 'Content-Type': content_type } } : {}
          )
    })
  }

  async loadToken(): Promise<void> {
    return getToken()
        .then(token => {
          if (token) {
            verifyTokenExpiration(token)
                .then((result) => {
                  this.updateAuthToken(result)
                })
          } else {
            this.updateAuthToken(null);
          }
        })
  }

  updateAuthToken(token: string | null) {
    if (token) {
      this.baseClient.defaults.headers.Authorization = `Bearer ${token}`
    } else {
      delete this.baseClient.defaults.headers.Authorization
    }
  }

  async getClient(): Promise<Axios & { defaults: { headers: { Authorization?: string } } }> {
    return this.loadToken()
        .then(() => {
          return this.baseClient
        })
  }
}

export default BaseService