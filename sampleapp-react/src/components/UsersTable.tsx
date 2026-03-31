import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Box,
} from '@mui/material';
import { Eye, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

type UsersTableProps = {
  users: User[];
};

export const UsersTable = ({ users }: UsersTableProps) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  if (users.length === 0) {
    return (
      <Typography color="text.secondary" align="center" py={4}>
        Нет пользователей
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Логин</TableCell>
            <TableCell align="center">Действия</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor:
                        currentUser?.id === user.id
                          ? 'primary.main'
                          : 'secondary.main',
                    }}
                  >
                    {user.login.charAt(0).toUpperCase()}
                  </Avatar>

                  <Typography>
                    {user.name || user.login}
                    {currentUser?.id === user.id && (
                      <Typography component="span" color="primary" sx={{ ml: 1 }}>
                        (это вы)
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>{user.id}</TableCell>
              <TableCell>{user.login}</TableCell>

              <TableCell align="center">
                <Tooltip title="Просмотреть профиль">
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/profile/${user.id}`)}
                    sx={{ mr: 1 }}
                  >
                    <Eye size={18} />
                  </IconButton>
                </Tooltip>

                {currentUser?.id === user.id && (
                  <Tooltip title="Редактировать">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/profile/${user.id}/edit`)}
                    >
                      <Edit2 size={18} />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};