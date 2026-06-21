import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedInfo = localStorage.getItem('userInfo');
        if (storedInfo) {
            try { return JSON.parse(storedInfo); } catch { return null; }
        }
        // Default to a mock user for demonstration purposes
        return {
            name: "Aditya Sharma",
            email: "aditya@iitb.ac.in",
            profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
            collegeName: "IIT Bombay"
        };
    });
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || "demo-token";
    });
    const [refreshToken, setRefreshToken] = useState(() => {
        return localStorage.getItem('refreshToken') || "demo-refresh-token";
    });

    // Load user from localStorage on mount
    useEffect(() => {
        const storedInfo = localStorage.getItem('userInfo');
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedToken && storedInfo) {
            try {
                setUser(JSON.parse(storedInfo));
                setToken(storedToken);
                if (storedRefreshToken) {
                    setRefreshToken(storedRefreshToken);
                }
            } catch {
                // If parsing fails, we keep the default mock state
            }
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
            setRefreshToken(data.refreshToken);
        }
        localStorage.setItem('userInfo', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
    };

    const logout = async () => {
        const rToken = localStorage.getItem('refreshToken') || refreshToken;
        if (rToken && rToken !== "demo-refresh-token") {
            try {
                await API.post('/auth/logout', { refreshToken: rToken });
            } catch (err) {
                console.error('Logout error on backend:', err.message);
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        setToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    const updateUser = (updatedData) => {
        const merged = { ...user, ...updatedData };
        localStorage.setItem('userInfo', JSON.stringify(merged));
        setUser(merged);
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider value={{
            user,
            token,
            refreshToken,
            loading,
            isAuthenticated,
            login,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
