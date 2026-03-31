import { apiClient } from './client';
import type { User } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get<User[]>('/Users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await apiClient.get<User>(`/Users/${id}`);
  return response.data;
};

export const createUser = async (user: Partial<User>) => {
  const response = await apiClient.post('/Users', user);
  return response.data;
};

export const updateUser = async (
  id: number,
  user: Partial<User>
): Promise<User> => {
  const response = await apiClient.put<User>(`/Users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await apiClient.delete(`/Users/${id}`);
  return response.data;
};
