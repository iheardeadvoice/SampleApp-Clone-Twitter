import { apiClient } from './client';
import type { FeedPost } from '../types';

export const getFeed = async (): Promise<FeedPost[]> => {
  const response = await apiClient.get<FeedPost[]>('/Feed');
  return response.data;
};

export const getUserFeed = async (userId: number): Promise<FeedPost[]> => {
  const response = await apiClient.get<FeedPost[]>(`/Feed/user/${userId}`);
  return response.data;
};