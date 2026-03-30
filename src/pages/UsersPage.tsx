import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { RefreshCw, Users as UsersIcon } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UsersTable';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const UsersPage = () => {
  const { users, loading, error, refetch, totalCount } = useUsers();

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <UsersIcon size={28} color="#3f51b5" />
            <Typography variant="h4">Пользователи {totalCount > 0 && `(${totalCount})`}</Typography>
          </Box>
          <Button variant="contained" startIcon={<RefreshCw size={18} />} onClick={refetch}>
            Обновить
          </Button>
        </Box>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        <UsersTable users={users} />
      </Paper>
    </Container>
  );
};