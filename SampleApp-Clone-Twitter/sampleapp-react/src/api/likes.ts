import { apiClient } from './client';
import type { ToggleLikeResponse } from '../types';

export const getLikeState = async (
  micropostId: number
): Promise<ToggleLikeResponse> => {
  const response = await apiClient.get<ToggleLikeResponse>(
    `/Likes/${micropostId}`
  );
  return response.data;
};

export const toggleLike = async (
  micropostId: number
): Promise<ToggleLikeResponse> => {
  const response = await apiClient.post<ToggleLikeResponse>(
    `/Likes/${micropostId}`
  );
  return response.data;
};