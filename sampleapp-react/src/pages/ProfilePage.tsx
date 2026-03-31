import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Paper, Avatar,
    Chip, CircularProgress, Alert, Button, Divider
} from '@mui/material';
import { User as UserIcon, Shield, Mail, Calendar, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById } from '../api/users';
import type { User } from '../types';

export const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getUserById(parseInt(id));
                setUser(data);
            } catch (err) {
                setError('Не удалось загрузить профиль');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [id]);

    const isOwnProfile = currentUser?.id === user?.id;

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Пользователь не найден'}</Alert>
                <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Назад
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button startIcon={<ArrowLeft size={18} />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Назад
            </Button>

            <Paper sx={{ p: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Avatar sx={{ width: 100, height: 100, bgcolor: isOwnProfile ? 'primary.main' : 'secondary.main', mb: 2 }}>
                        <UserIcon size={50} />
                    </Avatar>

                    <Typography variant="h4" gutterBottom>
                        {user.name || user.login}
                    </Typography>

                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        @{user.login}
                    </Typography>

                    {isOwnProfile && (
                        <Chip
                            icon={<Shield size={14} />}
                            label="Это вы"
                            color="primary"
                            sx={{ mt: 1 }}
                        />
                    )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <UserIcon size={20} color="#666" />
                        <Typography variant="body1">
                            <strong>ID:</strong> {user.id}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={2}>
                        <Mail size={20} color="#666" />
                        <Typography variant="body1">
                            <strong>Логин:</strong> {user.login}
                        </Typography>
                    </Box>

                    {user.token && (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Shield size={20} color="#4caf50" />
                            <Typography variant="body1">
                                <strong>JWT токен:</strong> активен
                            </Typography>
                        </Box>
                    )}
                </Box>

                {isOwnProfile && currentUser?.token && (
                    <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                        <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                            Ваш JWT токен:
                        </Typography>
                        <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                            {currentUser.token}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};