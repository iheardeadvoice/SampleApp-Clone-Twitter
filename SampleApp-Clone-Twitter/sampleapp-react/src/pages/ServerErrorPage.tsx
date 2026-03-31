import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const ServerErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 6, textAlign: 'center' }}>
        <AlertTriangle size={80} color="#f44336" />

        <Typography
          variant="h1"
          sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#f44336' }}
        >
          500
        </Typography>

        <Typography variant="h4" gutterBottom>
          Ошибка сервера
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          Произошла внутренняя ошибка сервера. Пожалуйста, попробуйте позже.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
            <Typography
              variant="body2"
              component="pre"
              sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', m: 0 }}
            >
              {JSON.stringify(error, null, 2)}
            </Typography>
          </Alert>
        )}

        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<Home size={20} />}
            onClick={() => navigate('/')}
          >
            На главную
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshCw size={20} />}
            onClick={() => window.location.reload()}
          >
            Обновить
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
