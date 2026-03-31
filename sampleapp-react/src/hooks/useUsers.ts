import { useState, useEffect } from 'react';
import { getUsers } from '../api/users';
import type { User } from '../types';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { withLoading } = useLoading();
    const { token } = useAuth();  // Убрали user, так как он не используется

    const loadUsers = async () => {
        console.log('loadUsers called, token exists:', !!token);
        
        if (!token) {
            console.warn('No token, skipping loadUsers');
            return;
        }
        
        try {
            setError(null);
            const data = await withLoading(getUsers());
            console.log('Users loaded:', data.length);
            setUsers(data);
        } catch (err: any) {
            console.error('Error loading users:', err.response?.status, err.message);
            setError('Не удалось загрузить пользователей');
        }
    };

    useEffect(() => {
        if (token) {
            loadUsers();
        }
    }, [token]);

    return {
        users,
        error,
        refetch: loadUsers,
        totalCount: users.length,
    };
};