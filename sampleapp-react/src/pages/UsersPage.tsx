import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Stack,
  Badge,
} from '@mui/material';
import {
  RefreshCw,
  Users as UsersIcon,
  Filter,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useLoading } from '../contexts/LoadingContext';
import { useAuth } from '../contexts/AuthContext';
import { UsersTable } from '../components/UsersTable';
import { SearchBar } from '../components/SearchBar';
import { PaginationControls } from '../components/PaginationControls';
import { ErrorMessage } from '../components/ErrorMessage';
import { ButtonLoader } from '../components/ButtonLoader';

export const UsersPage = () => {
  const {
    users,
    filteredCount,
    totalCount,
    error,
    refetch,
    sortConfig,
    requestSort,
    searchText,
    handleSearch,
    clearSearch,
    page,
    rowsPerPage,
    rowsPerPageOptions,
    handleChangePage,
    handleChangeRowsPerPage,
    from,
    to,
  } = useUsers();

  const { isLoading } = useLoading();
  const { token } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Заголовок */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <UsersIcon size={28} color="#3f51b5" />
            <Typography variant="h4">
              Пользователи
            </Typography>
            <Chip
              label={`Всего: ${totalCount}`}
              size="small"
              color="primary"
              variant="outlined"
            />
            {searchText && (
              <Chip
                label={`Найдено: ${filteredCount}`}
                size="small"
                color="success"
                variant="outlined"
                onDelete={clearSearch}
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

        {/* Поиск */}
        <Box mb={3}>
          <SearchBar
            value={searchText}
            onChange={handleSearch}
            placeholder="Поиск по логину, имени или ID..."
            disabled={isLoading}
          />
        </Box>

        {/* Информация о текущей странице */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" color="text.secondary">
            Показаны записи {from}-{to} из {filteredCount}
          </Typography>
          
          {sortConfig.key && (
            <Chip
              icon={sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              label={`Сортировка по ${sortConfig.key} (${sortConfig.direction === 'asc' ? 'возр' : 'убыв'})`}
              size="small"
              variant="outlined"
              onDelete={() => requestSort('id')}
            />
          )}
        </Box>

        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {/* Таблица */}
        <UsersTable
          users={users}
          sortConfig={sortConfig}
          onSort={requestSort}
        />

        {/* Пагинация */}
        {filteredCount > 0 && (
          <PaginationControls
            count={filteredCount}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}

        {/* Информация о JWT */}
        {token && (
          <Box mt={2} p={2} bgcolor="#f5f5f5" borderRadius={1}>
            <Typography variant="caption" color="text.secondary">
              JWT токен активен • Запросы авторизованы
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};