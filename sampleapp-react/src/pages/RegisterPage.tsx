import React from 'react';
import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/RegisterForm';
import { UserPlus } from 'lucide-react';

export const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <UserPlus size={48} color="#1976d2" />
                    <Typography variant="h4" sx={{ mt: 2 }}>Регистрация</Typography>
                </Box>

                <RegisterForm onSuccess={() => navigate('/login')} />

                <Box textAlign="center" mt={2}>
                    <Typography variant="body2">
                        Уже есть аккаунт?{' '}
                        <Button color="primary" onClick={() => navigate('/login')}>
                            Войти
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};