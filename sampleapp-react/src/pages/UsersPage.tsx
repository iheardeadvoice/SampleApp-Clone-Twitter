import { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UsersService } from '../services/UsersService';
import type { User } from '../types';

export const UsersPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await UsersService.getAll(user.token);
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('Не удалось загрузить пользователей');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user, navigate]);

    if (!user) return null;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Пользователи
            </Typography>

            {loading && (
                <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                </Box>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Логин</TableCell>
                                <TableCell>Имя</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((userItem) => (
                                <TableRow key={userItem.id}>
                                    <TableCell>{userItem.id}</TableCell>
                                    <TableCell>{userItem.login}</TableCell>
                                    <TableCell>{userItem.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};