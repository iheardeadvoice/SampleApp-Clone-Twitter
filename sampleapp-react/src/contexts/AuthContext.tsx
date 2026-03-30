import React, { createContext, useState, useContext, useEffect } from 'react';
import type { User } from '../types';
import { login as loginApi, register as registerApi } from '../api/auth';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (login: string, password: string) => Promise<void>;
    register: (data: { login: string; password: string; name?: string }) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (login: string, password: string) => {
        const userData = await loginApi(login, password);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = async (data: { login: string; password: string; name?: string }) => {
        await registerApi(data);
        // После регистрации не логиним автоматически
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};