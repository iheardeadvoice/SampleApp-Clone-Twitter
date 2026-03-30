import React from 'react';
import { Container, Typography, Box, Paper, Avatar } from '@mui/material';
import { Home, Users, Sparkles } from 'lucide-react';

export const HomePage = () => (
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
        Добро пожаловать!
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        SampleApp на React
      </Typography>
      <Typography variant="body1">Демонстрационное приложение для работы с пользователями</Typography>
    </Paper>
  </Container>
);