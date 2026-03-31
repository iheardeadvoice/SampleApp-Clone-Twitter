import { useState, useEffect } from 'react';
import { getUsers } from '../api/users';
import type { User } from '../types';
import { useLoading } from '../contexts/LoadingContext';
import { useSort } from './useSort';
import { useSearch } from './useSearch';
import { usePagination } from './usePagination';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { withLoading } = useLoading();

  // Сортировка
  const { sortedData, sortConfig, requestSort } = useSort<User>(users, {
    key: 'id',
    direction: 'asc',
  });

  // Поиск
  const {
    searchText,
    filteredData: searchedUsers,
    handleSearch,
    clearSearch,
  } = useSearch({
    data: sortedData,
    searchFields: ['login', 'name', 'id'],
  });

  // Пагинация
  const {
    paginatedData,
    page,
    rowsPerPage,
    rowsPerPageOptions,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPagination,
    totalCount,
    from,
    to,
  } = usePagination(searchedUsers, { initialRowsPerPage: 5 });

  // Сброс пагинации при поиске
  useEffect(() => {
    resetPagination();
  }, [searchText, resetPagination]);

  const loadUsers = async () => {
    try {
      setError(null);
      const data = await withLoading(getUsers());
      setUsers(data);
    } catch (err) {
      setError('Не удалось загрузить пользователей');
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    // Данные
    users: paginatedData,
    allUsers: users,
    filteredCount: searchedUsers.length,
    totalCount: users.length,
    error,
    refetch: loadUsers,
    
    // Сортировка
    sortConfig,
    requestSort,
    
    // Поиск
    searchText,
    handleSearch,
    clearSearch,
    
    // Пагинация
    page,
    rowsPerPage,
    rowsPerPageOptions,
    handleChangePage,
    handleChangeRowsPerPage,
    from,
    to,
  };
};