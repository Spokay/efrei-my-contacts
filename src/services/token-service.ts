import { jwtDecode } from 'jwt-decode'

const storeToken = async (token: string): Promise<void> => {
    localStorage.setItem('access_token', token)
}

const getToken = async (): Promise<string | null> => {
  return localStorage.getItem('access_token');
}

const removeToken = async (): Promise<void> => {
    localStorage.removeItem('access_token')
}

const isTokenExpired = (token: string): boolean => {
  if (token) {
    const decoded = jwtDecode(token)
    if (!decoded.exp) {
      return true
    }

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  }
  return true
}

const verifyTokenExpiration = async (token: string): Promise<string | null> => {
  const tokenExpired = isTokenExpired(token)
  if (tokenExpired) {
    await removeToken()
    return null
  }
  return token
}

export {
  storeToken,
  getToken,
  removeToken,
  isTokenExpired,
  verifyTokenExpiration
}