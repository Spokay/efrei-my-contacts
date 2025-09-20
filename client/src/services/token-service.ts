import {jwtDecode} from 'jwt-decode'

const storeToken = async (token: string): Promise<void> => {
    localStorage.setItem('accessToken', token)
}

const getToken = async (): Promise<string | null> => {
    return localStorage.getItem('accessToken');
}

const removeToken = async (): Promise<void> => {
    localStorage.removeItem('accessToken')
}

const getTokenAndVerifyExpiration = async (): Promise<string | null> => {
    try {
        const token = await getToken()
        if (token) {
            return await verifyTokenExpiration(token)
        }
        return null
    } catch (error) {
        console.error('Token verification failed:', error)
        await removeToken()
        return null
    }
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
    getTokenAndVerifyExpiration,
    removeToken,
    isTokenExpired,
    verifyTokenExpiration
}