import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { User } from '../types';

type UsersTableProps = {
    users: User[];
};

export const UsersTable = ({ users }: UsersTableProps) => {
    if (users.length === 0) {
        return <p>Нет пользователей</p>;
    }

    return (
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
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.login}</TableCell>
                            <TableCell>{user.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};