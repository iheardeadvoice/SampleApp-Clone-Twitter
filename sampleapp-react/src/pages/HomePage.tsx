import { Container, Paper, Typography, Box, Button } from '@mui/material';
import { Home, Users, LogIn, UserPlus, Table2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container
      maxWidth={false}
      sx={{ py: 4, px: { xs: 2, sm: 3, md: 4, lg: 6 } }}
    >
      <Paper sx={{ p: 6, textAlign: 'center', width: '100%' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Home size={64} color="#1976d2" />
        </Box>

        {user ? (
          <>
            <Typography variant="h2" gutterBottom>
              Добро пожаловать, {user.login}!
            </Typography>

            <Typography variant="h5" color="text.secondary" paragraph>
              ID: {user.id} • {user.name || 'Без имени'}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Вы авторизованы в системе. Можете перейти к списку пользователей,
              открыть свой профиль или протестировать демо таблицы.
            </Typography>

            <Box
              display="flex"
              gap={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Users size={20} />}
                onClick={() => navigate('/users')}
              >
                Пользователи
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                Мой профиль
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Table2 size={20} />}
                onClick={() => navigate('/table-demo')}
              >
                Демо таблицы
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h2" gutterBottom>
              Добро пожаловать!
            </Typography>

            <Typography variant="h5" color="text.secondary" paragraph>
              SampleApp на React
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Авторизуйтесь или зарегистрируйтесь, чтобы получить доступ к
              защищённым страницам, профилям пользователей, редактированию
              данных и демо таблицы.
            </Typography>

            <Box
              display="flex"
              gap={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<LogIn size={20} />}
                onClick={() => navigate('/login')}
              >
                Войти
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<UserPlus size={20} />}
                onClick={() => navigate('/register')}
              >
                Регистрация
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Table2 size={20} />}
                onClick={() => navigate('/table-demo')}
              >
                Демо таблицы
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};