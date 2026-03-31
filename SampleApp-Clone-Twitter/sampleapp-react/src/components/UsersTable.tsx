import React from 'react';
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
  Chip,
} from '@mui/material';
import { Eye, Edit2, User as UserIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { SortableTableHeader } from './SortableTableHeader';
import type { SortConfig } from '../hooks/useSort';

type UsersTableProps = {
  users: User[];
  sortConfig: SortConfig<User>;
  onSort: (field: keyof User) => void;
};

export const UsersTable = ({ users, sortConfig, onSort }: UsersTableProps) => {
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
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <SortableTableHeader<User>
              field="id"
              label="ID"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={onSort}
              width={80}
            />
            <SortableTableHeader<User>
              field="login"
              label="Логин"
              currentSort={sortConfig.key}
              direction={sortConfig.direction}
              onSort={onSort}
            />
            <TableCell align="center" width={120}>Действия</TableCell>
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
                      bgcolor: currentUser?.id === user.id ? 'primary.main' : 'secondary.main',
                    }}
                  >
                    {user.login.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1">
                      {user.name || user.login}
                    </Typography>
                    {user.name && (
                      <Typography variant="caption" color="text.secondary">
                        @{user.login}
                      </Typography>
                    )}
                  </Box>
                  {currentUser?.id === user.id && (
                    <Chip
                      label="Это вы"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
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
