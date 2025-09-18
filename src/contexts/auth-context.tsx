import React, {createContext, useState, useContext, useEffect, type ReactNode, useCallback} from 'react'
import {AuthService, authService} from '../services/auth-service'
import type {UserResponse} from '../services/dto/auth-dto'

interface IAuth {
    user: UserResponse | null
    setUser: (user: UserResponse | null) => void
    isAuthenticated: boolean
    setIsAuthenticated: (value: boolean) => void
    loading: boolean
    setLoading: (value: boolean) => void
    authService: AuthService
    handleConnection: () => Promise<void>
    logout: () => Promise<void>
    isAuthReady: boolean
}

const AuthContext = createContext<IAuth | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserResponse | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false)

    const authServiceInstance: AuthService = authService

    const handleConnection = async () => {
        setLoading(true)

        return fetchUser()
            .catch(() => {
                resetAuthState()
            })
            .finally(() => {
                setLoading(false)
                setIsAuthReady(true)
            })
    }

    const handleLogout = async () => {
        setLoading(true)

        return authServiceInstance.logout()
            .then(() => {
                resetAuthState()
            })
            .catch((error) => {
                console.error('Logout error:', error)
                resetAuthState()
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const resetAuthState = () => {
        setUser(null)
        setIsAuthenticated(false)
    }

    const fetchUser = useCallback(async () => {
        return authServiceInstance.getUser()
            .then((user) => {
                setUser(user)
                setIsAuthenticated(true)
            })
            .catch((error) => {
                resetAuthState()
                throw error
            })
    }, [authServiceInstance])


    useEffect(() => {
        const initializeAuth = async () => {
            try {
                await fetchUser()
            } catch (error) {
                console.error('Auth initialization error:', error)
                resetAuthState()
            } finally {
                setLoading(false)
                setIsAuthReady(true)
            }
        }

        initializeAuth().then()
    }, [fetchUser])

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated,
                setIsAuthenticated,
                loading,
                setLoading,
                authService: authServiceInstance,
                handleConnection,
                logout: handleLogout,
                isAuthReady
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const UseAuthContext = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('UseAuthContext must be used within an AppProvider')
    }
    return context
}