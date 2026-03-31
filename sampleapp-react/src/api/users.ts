import { apiClient } from './client';
import type { User } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getUsers = async (): Promise<User[]> => {
    await delay(1000);
    const response = await apiClient.get<User[]>('/Users');
    return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
    await delay(800);
    const response = await apiClient.get<User>(`/Users/${id}`);
    return response.data;
};

export const createUser = async (data: { login: string; password: string; name?: string }): Promise<User> => {
    await delay(1200);
    const response = await apiClient.post('/Users', data);
    return response.data;
};