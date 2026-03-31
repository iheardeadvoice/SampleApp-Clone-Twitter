import { Container, Typography, Box, Button, Paper, Chip } from '@mui/material';
import { RefreshCw, Users as UsersIcon } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useLoading } from '../contexts/LoadingContext';
import { UsersTable } from '../components/UsersTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { ButtonLoader } from '../components/ButtonLoader';

export const UsersPage = () => {
    const { users, error, refetch, totalCount } = useUsers();
    const { isLoading } = useLoading();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <UsersIcon size={28} color="#1976d2" />
                        <Typography variant="h4">
                            Пользователи {totalCount > 0 && `(${totalCount})`}
                        </Typography>
                        {isLoading && (
                            <Chip
                                label="Загрузка..."
                                size="small"
                                color="primary"
                                sx={{ ml: 2 }}
                            />
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        onClick={() => refetch()}
                        disabled={isLoading}
                        startIcon={isLoading ? <ButtonLoader /> : <RefreshCw size={18} />}
                    >
                        {isLoading ? 'Загрузка...' : 'Обновить'}
                    </Button>
                </Box>

                {error && <ErrorMessage message={error} onRetry={refetch} />}

                <UsersTable users={users} />
            </Paper>
        </Container>
    );
};