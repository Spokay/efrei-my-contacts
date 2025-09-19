import React, {createContext, type ReactNode, useContext, useEffect, useState} from 'react'
import {AuthService, authService} from '../services/auth-service'
import {UserService, userService} from '../services/user-service'
import type {UserResponse} from '../services/dto/auth-dto'
import {getTokenAndVerifyExpiration} from '../services/token-service'

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

const AuthContext = createContext<IAuth | undefined>(undefined);

export const AppAuthContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

    const authServiceInstance: AuthService = authService;
    const userServiceInstance: UserService = userService;

    const handleConnection = async () => {
        setLoading(true);

        return fetchUser()
            .catch(() => {
                resetAuthState()
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleLogout = async () => {
        setLoading(true);

        return authServiceInstance.logout()
            .then(() => {
                resetAuthState();
            })
            .catch((error) => {
                console.error('Logout error:', error);
                resetAuthState();
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const resetAuthState = () => {
        setUser(null);
        setIsAuthenticated(false);
    }

    const fetchUser = async () => {
        return userServiceInstance.getUserInfo()
            .then((user) => {
                console.log('Fetched user info:', user);
                setUser(user);
                setIsAuthenticated(true);
            })
            .catch((error) => {
                resetAuthState();
                throw error;
            })
    }

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = await getTokenAndVerifyExpiration();
                if (token) {
                        await fetchUser();
                } else {
                    resetAuthState();
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                resetAuthState();
            } finally {
                setLoading(false);
                setIsAuthReady(true);
            }
        }

        initializeAuth().then();
    }, [])

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
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('UseAuthContext must be used within an AppProvider');
    }
    return context;
}