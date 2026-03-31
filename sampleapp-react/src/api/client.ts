import axios from 'axios';

const API_URL = 'http://localhost:5026/api';

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

// Получение токена из localStorage
const getToken = (): string | null => {
    try {
        const userStr = localStorage.getItem('user');
        console.log('getToken - localStorage user:', userStr);
        
        if (!userStr) return null;
        
        const user = JSON.parse(userStr);
        console.log('getToken - token exists:', !!user?.token);
        
        return user?.token || null;
    } catch (e) {
        console.error('Error getting token:', e);
        return null;
    }
};

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Интерцептор запроса — добавляет токен
apiClient.interceptors.request.use((config) => {
    const token = getToken();
    
    // Не добавляем токен для запросов логина и регистрации
    const isAuthRequest = config.url?.includes('/Users/Login') || 
                          (config.url === '/Users' && config.method === 'post');
    
    console.log(`Request to: ${config.url}, method: ${config.method}, hasToken: ${!!token}, isAuthRequest: ${isAuthRequest}`);
    
    if (token && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Authorization header added');
    } else if (!token && !isAuthRequest) {
        console.warn('⚠️ No token available for request:', config.url);
    }
    
    activeRequests++;
    updateLoadingState();
    return config;
});

// Интерцептор ответа — обрабатывает 401
apiClient.interceptors.response.use(
    (response) => {
        activeRequests--;
        updateLoadingState();
        return response;
    },
    (error) => {
        activeRequests--;
        updateLoadingState();
        
        console.error('Response error:', error.response?.status, error.config?.url);
        
        if (error.response?.status === 401) {
            console.log('❌ 401 Unauthorized - logging out');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);