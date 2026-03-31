import { apiClient } from './client';
import type { PostComment } from '../types';

export const getCommentsByMicropost = async (
  micropostId: number
): Promise<PostComment[]> => {
  const response = await apiClient.get<PostComment[]>(
    `/Comments/micropost/${micropostId}`
  );
  return response.data;
};

export const createComment = async (
  micropostId: number,
  content: string
): Promise<PostComment> => {
  const response = await apiClient.post<PostComment>(
    `/Comments/micropost/${micropostId}`,
    { content }
  );
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  const response = await apiClient.delete(`/Comments/${commentId}`);
  return response.data;
};