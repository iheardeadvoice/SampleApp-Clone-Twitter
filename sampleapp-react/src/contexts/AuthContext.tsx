import { createContext, useState, useContext, useEffect } from 'react';
import type { User, RegisterData } from '../types';
import { login as loginApi, register as registerApi } from '../api/auth';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (login: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    token: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Загрузка пользователя из localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        console.log('Loading user from localStorage:', savedUser);
        
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser) as User;
                console.log('User loaded, token exists:', !!parsedUser.token);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user:', error);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (login: string, password: string) => {
        console.log('Login attempt:', login);
        const userData = await loginApi(login, password);
        console.log('Login response, token:', !!userData.token);
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const register = async (data: RegisterData) => {
        console.log('Register attempt:', data.login);
        await registerApi(data);
    };

    const logout = () => {
        console.log('Logout');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            token: user?.token || null
        }}>
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