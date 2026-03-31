import { Button, Container, Paper, Typography } from '@mui/material';
import { AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <AlertCircle size={80} color="#f44336" />

        <Typography
          variant="h1"
          sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#f44336' }}
        >
          404
        </Typography>

        <Typography variant="h4" gutterBottom>
          Страница не найдена
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Запрашиваемая страница не существует или была перемещена.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Home size={20} />}
          onClick={() => navigate('/')}
        >
          На главную
        </Button>
      </Paper>
    </Container>
  );
};
