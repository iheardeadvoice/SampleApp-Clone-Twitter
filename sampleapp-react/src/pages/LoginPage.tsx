import { useEffect } from 'react';
import { Container, Paper, Typography, Box, Alert, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Lock } from 'lucide-react';

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const registered = location.state?.registered;

    useEffect(() => {
        if (registered) {
            window.history.replaceState({}, document.title);
        }
    }, [registered]);

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Lock size={48} color="#1976d2" />
                    <Typography variant="h4" sx={{ mt: 2 }}>Вход</Typography>
                </Box>

                {registered && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Регистрация успешна! Теперь вы можете войти.
                    </Alert>
                )}

                <LoginForm onSuccess={() => navigate('/')} />

                <Box textAlign="center" mt={2}>
                    <Typography variant="body2">
                        Нет аккаунта?{' '}
                        <Button color="primary" onClick={() => navigate('/register')}>
                            Зарегистрироваться
                        </Button>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};