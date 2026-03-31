import { useState, type ChangeEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { AlertTriangle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PreventUnsavedChanges } from '../components/guards/PreventUnsavedChanges';

export const GuardsDemoPage = () => {
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const isDirty = text.trim().length > 0;

  return (
    <PreventUnsavedChanges
      isDirty={isDirty}
      message="У вас есть несохраненный текст. Вы действительно хотите уйти?"
    >
      {({ confirmNavigate }) => (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Shield size={32} color="#3f51b5" />
              <Typography variant="h4">Демо защитников</Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Введите текст и попробуйте уйти со страницы — появится предупреждение.
              </Typography>
            </Alert>

            <TextField
              fullWidth
              label="Введите что-нибудь"
              value={text}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={() => confirmNavigate(() => navigate('/'))}
              >
                На главную
              </Button>

              <Button
                variant="outlined"
                onClick={() => confirmNavigate(() => navigate('/users'))}
              >
                К пользователям
              </Button>
            </Box>

            {isDirty && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AlertTriangle size={16} />
                  Есть несохраненные изменения!
                </Box>
              </Alert>
            )}
          </Paper>
        </Container>
      )}
    </PreventUnsavedChanges>
  );
};