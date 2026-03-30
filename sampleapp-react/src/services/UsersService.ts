import axios from 'axios';
import type { User } from '../types';

const API_URL = 'http://localhost:5026/api';

export const UsersService = {
    getAll: async (token?: string): Promise<User[]> => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get<User[]>(`${API_URL}/Users`, { headers });
        return response.data;
    },

    getById: async (id: number, token?: string): Promise<User> => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get<User>(`${API_URL}/Users/${id}`, { headers });
        return response.data;
    },

    create: async (user: Partial<User>): Promise<User> => {
        const response = await axios.post<User>(`${API_URL}/Users`, user, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    update: async (user: User, token?: string): Promise<User> => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.put<User>(`${API_URL}/Users`, user, {
            headers: { ...headers, 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    delete: async (id: number, token?: string): Promise<boolean> => {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.delete<boolean>(`${API_URL}/Users/${id}`, { headers });
        return response.data;
    }
};