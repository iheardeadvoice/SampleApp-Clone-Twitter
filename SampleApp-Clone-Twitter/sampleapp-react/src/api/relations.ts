import { apiClient } from './client';
import type { FollowState, UserPreview } from '../types';

export const getFollowers = async (userId: number): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>(
    `/Relations/followers/${userId}`
  );
  return response.data;
};

export const getFollowing = async (userId: number): Promise<UserPreview[]> => {
  const response = await apiClient.get<UserPreview[]>(
    `/Relations/following/${userId}`
  );
  return response.data;
};

export const getFollowState = async (
  userId: number
): Promise<FollowState> => {
  const response = await apiClient.get<FollowState>(`/Relations/state/${userId}`);
  return response.data;
};

export const followUser = async (userId: number): Promise<FollowState> => {
  const response = await apiClient.post<FollowState>(
    `/Relations/follow/${userId}`
  );
  return response.data;
};

export const unfollowUser = async (userId: number): Promise<FollowState> => {
  const response = await apiClient.delete<FollowState>(
    `/Relations/follow/${userId}`
  );
  return response.data;
};