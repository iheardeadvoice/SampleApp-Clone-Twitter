import { useState, useMemo, useCallback } from 'react';

type UseSearchProps<T> = {
  data: T[];
  searchFields: (keyof T)[];
  initialSearch?: string;
};

export const useSearch = <T extends Record<string, any>>({
  data,
  searchFields,
  initialSearch = '',
}: UseSearchProps<T>) => {
  const [searchText, setSearchText] = useState(initialSearch);

  const filteredData = useMemo(() => {
    if (!searchText.trim()) return data;

    const searchLower = searchText.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field]?.toString().toLowerCase() || '';
        return value.includes(searchLower);
      })
    );
  }, [data, searchText, searchFields]);

  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchText('');
  }, []);

  return {
    searchText,
    filteredData,
    handleSearch,
    clearSearch,
    setSearchText,
  };
};