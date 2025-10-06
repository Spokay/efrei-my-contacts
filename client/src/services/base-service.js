import {getToken, verifyTokenExpiration} from './token-service'
import {BACKEND_BASE_URL} from "../configuration/config"
import axios from 'axios'

class BaseService {
  constructor() {
    this.baseUrl = BACKEND_BASE_URL
    this.baseClient = this.createClient()
  }

  createClient() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
  }

  async resetClient() {
    delete this.baseClient.defaults.headers.Authorization
  }

  async fetchData(url, params) {
    return this.getClient()
        .then(client => {
          return client.get(`${this.baseUrl}${url}`, params)
        })
  }

  async postData(url, data, content_type) {
    return this.getClient()
        .then(client => {
            return client.post(
                `${this.baseUrl}${url}`,
                data,
                content_type ? { headers: { 'Content-Type': content_type } } : {}
            )
        })
  }

  async deleteData(url) {
    return this.getClient()
        .then(client => {
      return client.delete(`${this.baseUrl}${url}`);
    })
  }

  async putData(url, data, content_type) {
    return this.getClient()
        .then(client => {
          return client.put(
              `${this.baseUrl}${url}`,
              data,
              content_type ? { headers: { 'Content-Type': content_type } } : {}
          )
    })
  }

  async loadToken() {
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

  updateAuthToken(token) {
    if (token) {
      this.baseClient.defaults.headers.Authorization = `Bearer ${token}`
    } else {
      delete this.baseClient.defaults.headers.Authorization
    }
  }

  async getClient() {
    return this.loadToken()
        .then(() => {
          return this.baseClient
        })
  }
}

export default BaseService
