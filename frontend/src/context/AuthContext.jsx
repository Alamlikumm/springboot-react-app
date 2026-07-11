import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await authService.getCurrentUser();
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to get current user', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [token]);

    const login = (tokenData, userData) => {
        localStorage.setItem('token', tokenData);
        setToken(tokenData);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Berhasil logout');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
