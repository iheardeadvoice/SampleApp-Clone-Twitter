export type User = {
  id: number;
  name: string;
  login: string;
  token: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginData = {
  login: string;
  password: string;
};

export type RegisterData = {
  login: string;
  password: string;
  name?: string;
  role?: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type FeedAuthor = {
  id: number;
  login: string;
  name: string;
};

export type FeedPost = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: FeedAuthor;
  likeCount: number;
  commentCount: number;
  isLikedByCurrentUser: boolean;
  isOwner: boolean;
};

export type PostComment = {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  userLogin: string;
  userName: string;
  isOwner: boolean;
};

export type FollowState = {
  userId: number;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
};

export type UserPreview = {
  id: number;
  login: string;
  name: string;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
};

export type ToggleLikeResponse = {
  isLiked: boolean;
  likeCount: number;
};