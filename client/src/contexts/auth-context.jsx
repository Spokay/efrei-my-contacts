import React, {createContext, useContext, useEffect, useState} from 'react'
import {AuthService, authService} from '../services/auth-service'
import {UserService, userService} from '../services/user-service'
import {getTokenAndVerifyExpiration} from '../services/token-service'

const AuthContext = createContext(undefined);

export const AppAuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const authServiceInstance = authService;
    const userServiceInstance = userService;

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
