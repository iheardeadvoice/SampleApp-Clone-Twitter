import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5026/api';

let activeRequests = 0;
let loadingCallback: ((loading: boolean) => void) | null = null;

export const setLoadingCallback = (callback: (loading: boolean) => void) => {
  loadingCallback = callback;
};

const updateLoadingState = () => {
  if (loadingCallback) {
    loadingCallback(activeRequests > 0);
  }
};

const getToken = (): string | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return user?.token || null;
  } catch {
    return null;
  }
};

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  const isAuthRequest =
    config.url?.includes('/Users/Login') ||
    (config.url === '/Users' && config.method === 'post');

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  activeRequests++;
  updateLoadingState();

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    activeRequests--;
    updateLoadingState();
    return response;
  },
  (error) => {
    activeRequests--;
    updateLoadingState();

    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);