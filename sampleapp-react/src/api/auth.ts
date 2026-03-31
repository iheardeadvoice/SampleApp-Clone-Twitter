import { apiClient } from './client';
import type { User, RegisterData } from '../types';

export const login = async (login: string, password: string): Promise<User> => {
    const response = await apiClient.post('/Users/Login', { login, password });
    return response.data;
};

export const register = async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/Users', data);
    return response.data;
};