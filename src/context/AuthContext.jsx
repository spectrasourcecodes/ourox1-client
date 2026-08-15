// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axios';

console.log('✅ AuthContext file loaded!');

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    console.log('✅ AuthProvider rendering!');
    
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState('pending'); // Added kycStatus state

    useEffect(() => {
        console.log('✅ AuthProvider useEffect running!');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsAuthenticated(true);
                console.log('✅ User restored from localStorage:', parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log('✅ Login function called!');
        try {
            const { data } = await axiosInstance.post('/api/user/login', {
                email,
                password
            });
            
            console.log('✅ Login response:', data);

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setIsAuthenticated(true);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const register = async (userData) => {
        console.log('✅ Register function called!');
        try {
            const { data } = await axiosInstance.post('/api/user/register', userData);
            
            console.log('✅ Register response:', data);

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                setIsAuthenticated(true);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('❌ Register error:', error);
            const message = error.response?.data?.message || 'Registration failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        console.log('✅ Logout called!');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setKycStatus('pending'); // Reset KYC status on logout
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        kycStatus,
        setKycStatus, // ← This is now exposed
        login,
        register,
        logout,
        updateUser: (userData) => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};