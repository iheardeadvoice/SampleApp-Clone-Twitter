import { useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const registered = location.state?.registered;
  const from = location.state?.from || '/';

  useEffect(() => {
    if (registered) {
      window.history.replaceState({}, document.title);
    }
  }, [registered]);

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Lock size={48} color="#3f51b5" />
          <Typography variant="h4" sx={{ mt: 2 }}>
            Вход
          </Typography>
        </Box>

        {registered && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Регистрация успешна! Теперь вы можете войти.
          </Alert>
        )}

        <LoginForm onSuccess={handleSuccess} />

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