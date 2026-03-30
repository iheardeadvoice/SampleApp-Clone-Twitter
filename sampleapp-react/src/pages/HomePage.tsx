import React from 'react';
import { Container, Typography, Box, Paper, Avatar, Button } from '@mui/material';
import { Home, Users, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                        <Home size={30} />
                    </Avatar>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60 }}>
                        <Users size={30} />
                    </Avatar>
                    <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60 }}>
                        <Sparkles size={30} />
                    </Avatar>
                </Box>

                <Typography variant="h2" gutterBottom>
                    {user ? `Добро пожаловать, ${user.login}!` : 'Добро пожаловать!'}
                </Typography>

                <Typography variant="h5" color="text.secondary" paragraph>
                    SampleApp на React
                </Typography>

                {!user && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button variant="contained" startIcon={<LogIn size={20} />} onClick={() => navigate('/login')}>
                            Войти
                        </Button>
                        <Button variant="outlined" startIcon={<UserPlus size={20} />} onClick={() => navigate('/register')}>
                            Регистрация
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};