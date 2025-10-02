import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Simple user object from token, you can fetch more details if needed
                setUser({ id: decoded.id }); 
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        }
        setIsAuthReady(true);
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthReady }}>
            {children}
        </AuthContext.Provider>
    );
};