import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export type SortConfig<T> = {
  key: keyof T | null;
  direction: SortDirection;
};

export const useSort = <T extends Record<string, unknown>>(
  data: T[],
  initialConfig?: SortConfig<T>
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(
    initialConfig || { key: null, direction: 'asc' }
  );

  const sortedData = useMemo(() => {
    const key = sortConfig.key;

    if (key === null) return data;

    return [...data].sort((a, b) => {
      const aRaw = a[key];
      const bRaw = b[key];

      const aNumber = Number(aRaw);
      const bNumber = Number(bRaw);

      const bothAreNumbers =
        aRaw !== null &&
        aRaw !== undefined &&
        bRaw !== null &&
        bRaw !== undefined &&
        !Number.isNaN(aNumber) &&
        !Number.isNaN(bNumber);

      if (bothAreNumbers) {
        return sortConfig.direction === 'asc'
          ? aNumber - bNumber
          : bNumber - aNumber;
      }

      const aValue = String(aRaw ?? '').toLowerCase();
      const bValue = String(bRaw ?? '').toLowerCase();

      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: SortDirection = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  return {
    sortedData,
    sortConfig,
    requestSort,
  };
};