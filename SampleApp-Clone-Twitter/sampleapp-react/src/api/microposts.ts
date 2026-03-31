import { apiClient } from './client';

export const createMicropost = async (content: string) => {
  const response = await apiClient.post('/Microposts', {
    content,
    userId: 0,
  });

  return response.data;
};

export const deleteMicropost = async (id: number) => {
  const response = await apiClient.delete(`/Microposts/${id}`);
  return response.data;
};