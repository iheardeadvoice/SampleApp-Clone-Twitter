import axios from 'axios';
import type { User } from '../types';

const API_URL = 'http://localhost:5026/api';

export const login = async (login: string, password: string): Promise<User> => {
    const response = await axios.post(`${API_URL}/Users/Login`, { login, password });
    return response.data;
};

export const register = async (data: { login: string; password: string; name?: string }): Promise<User> => {
    const response = await axios.post(`${API_URL}/Users`, data);
    return response.data;
};